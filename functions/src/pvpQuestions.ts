import { HttpsError } from "firebase-functions/v2/https";

import { regionValues, toRegionValue } from "./regions";
import { Champion, DDRAGON, championIcon, db, findByLabel, loadRoster, pick, readJson, shuffle as shuffleItems, spellIcon } from "./shared";

export const pvpRoundCount = 5;
type Choice = { id: string; name: string; icon?: string };
export type QuizQuestion = {
  category: string;
  prompt: string;
  image: string | null;
  text: string | null;
  options: Choice[];
  dataVersion: string;
};
export type QuizRound = { question: QuizQuestion; secret: { answerId: string } };
type QuizChampion = Champion & { title?: string; blurb?: string };
type Item = {
  name: string; image: { full: string }; maps?: Record<string, boolean>;
  gold?: { purchasable: boolean }; inStore?: boolean; hideFromAll?: boolean;
  requiredChampion?: string; requiredAlly?: string;
};
type SummonerSpell = { id: string; name: string; image: { full: string }; modes?: string[] };
type Ability = { name: string; image: { full: string } };
export type QuizCatalog = {
  version: string;
  champions: QuizChampion[];
  abilities: { championId: string; name: string; image: string }[];
  regions: { championId: string; region: string }[];
  items: Record<string, Item>;
  summonerSpells: SummonerSpell[];
};

const textOnly = (value: string) => value.replace(/<[^>]*>/g, "")
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&")
  .replace(/&nbsp;/g, " ").trim();
const uniqueNames = <T extends { name: string }>(entries: T[]) =>
  entries.filter((entry, index) => entry.name && entries.findIndex((other) =>
    other.name.toLowerCase() === entry.name.toLowerCase()) === index);

export const buildPvpRounds = (catalog: QuizCatalog, random = Math.random): QuizRound[] => {
  const shuffle = <T>(entries: T[]) => shuffleItems(entries, random);
  const choose = <T>(entries: T[]) => pick(entries, random);
  const champions = uniqueNames(catalog.champions);
  if (champions.length < 4) throw new HttpsError("unavailable", "Not enough champion data to create a quiz.");
  const championChoices = champions.map((champion) => ({
    id: champion.id, name: champion.name, icon: championIcon(champion.id, catalog.version),
  }));
  const round = (category: string, prompt: string, answer: Choice, choices: Choice[], image: string | null = null, text: string | null = null): QuizRound => ({
    question: {
      category, prompt, image, text, dataVersion: catalog.version,
      options: shuffle([answer, ...shuffle(choices.filter((choice) => choice.id !== answer.id)).slice(0, 3)]),
    },
    secret: { answerId: answer.id },
  });
  const championChoice = (id: string) => championChoices.find((choice) => choice.id === id)!;
  const factories: (() => QuizRound)[] = [];
  const abilities = catalog.abilities.filter((ability) => ability.name && ability.image && championChoice(ability.championId));
  if (abilities.length) factories.push(() => {
    const ability = choose(abilities);
    return round("Abilities", 'Which champion uses "' + textOnly(ability.name) + '"?',
      championChoice(ability.championId), championChoices, ability.image);
  });
  const regionNames: Record<string, string> = {
    "bandle-city": "Bandle City", bilgewater: "Bilgewater", demacia: "Demacia", freljord: "Freljord",
    ionia: "Ionia", ixtal: "Ixtal", "mt-targon": "Targon", noxus: "Noxus", piltover: "Piltover",
    "shadow-isles": "Shadow Isles", shurima: "Shurima", void: "The Void", zaun: "Zaun",
  };
  const regionChoices = [...new Set(Object.values(regionValues))].map((id) => ({ id, name: regionNames[id] }));
  const regions = catalog.regions.filter((entry) => championChoice(entry.championId) && regionNames[entry.region]
    && !catalog.regions.some((other) => other.championId === entry.championId && other.region !== entry.region));
  if (regions.length) factories.push(() => {
    const entry = choose(regions);
    const champion = championChoice(entry.championId);
    return round("Regions", "Which region is " + champion.name + " associated with?",
      regionChoices.find((choice) => choice.id === entry.region)!, regionChoices, champion.icon);
  });
  const items = uniqueNames(Object.entries(catalog.items)
    .filter(([id, item]) => /^\d+$/.test(id) && item.maps?.["11"] && item.gold?.purchasable && item.inStore !== false
      && !item.hideFromAll && !item.requiredChampion && !item.requiredAlly && item.image?.full && item.name)
    .map(([id, item]) => ({ id: "item-" + id, name: textOnly(item.name), image: DDRAGON + "/cdn/" + catalog.version + "/img/item/" + item.image.full })))
    .filter((item, index, entries) => entries.findIndex((other) => other.image === item.image) === index);
  if (items.length >= 4) factories.push(() => {
    const answer = choose(items);
    return round("Items", "Which Summoner's Rift item is shown here?",
      { id: answer.id, name: answer.name }, items.map(({ id, name }) => ({ id, name })), answer.image);
  });
  const titled = champions.filter((champion) => champion.title && champions.filter((other) =>
    other.title?.toLowerCase() === champion.title?.toLowerCase()).length === 1);
  if (titled.length) factories.push(() => {
    const champion = choose(titled);
    return round("Champions", 'Which champion is known as "' + textOnly(champion.title!) + '"?',
      championChoice(champion.id), championChoices);
  });
  const lore = champions.filter((champion) => champion.blurb && textOnly(champion.blurb).length >= 40);
  if (lore.length) factories.push(() => {
    const champion = choose(lore);
    const labels = [champion.name, champion.id, ...champion.name.split(/[\s&.'-]+/).filter((word) => word.length > 2)]
      .sort((a, b) => b.length - a.length).map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const excerpt = textOnly(champion.blurb!).replace(new RegExp("\\b(?:" + labels.join("|") + ")\\b", "gi"), "[...]");
    return round("Lore", "Whose story is described below?", championChoice(champion.id), championChoices, null, excerpt);
  });
  const spells = uniqueNames(catalog.summonerSpells.filter((spell) => spell.modes?.includes("CLASSIC") && spell.image?.full && spell.name)
    .map((spell) => ({ id: "summoner-" + spell.id, name: textOnly(spell.name), image: spellIcon(spell.image.full, catalog.version) })))
    .filter((spell, index, entries) => entries.findIndex((other) => other.image === spell.image) === index);
  if (spells.length >= 4) factories.push(() => {
    const answer = choose(spells);
    return round("Summoner spells", "Which summoner spell is shown here?",
      { id: answer.id, name: answer.name }, spells.map(({ id, name }) => ({ id, name })), answer.image);
  });
  if (factories.length < pvpRoundCount) throw new HttpsError("unavailable", "Not enough question categories are available. Please try again.");
  return shuffle(factories).slice(0, pvpRoundCount).map((factory) => factory());
};

let staticData: { version: string; promise: Promise<{ items: Record<string, Item>; summonerSpells: SummonerSpell[] }> } | null = null;

export const loadPvpRounds = async (): Promise<QuizRound[]> => {
  const { version, champions } = await loadRoster();
  if (!staticData || staticData.version !== version) {
    staticData = {
      version,
      promise: Promise.all([
        readJson<{ data: Record<string, Item> }>(DDRAGON + "/cdn/" + version + "/data/en_US/item.json"),
        readJson<{ data: Record<string, SummonerSpell> }>(DDRAGON + "/cdn/" + version + "/data/en_US/summoner.json"),
      ]).then(([items, spells]) => ({ items: items.data, summonerSpells: Object.values(spells.data) }))
        .catch((error) => { staticData = null; throw error; }),
    };
  }
  const champion = pick(champions);
  const [assets, details, regions] = await Promise.all([
    staticData.promise,
    readJson<{ data: Record<string, { spells: Ability[]; passive?: Ability }> }>(
      DDRAGON + "/cdn/" + version + "/data/en_US/champion/" + champion.id + ".json"),
    db.collection("championRegions").get(),
  ]);
  const kit = details.data[champion.id];
  const abilities = [...kit.spells, ...(kit.passive ? [kit.passive] : [])].map((ability) => ({
    championId: champion.id, name: ability.name,
    image: DDRAGON + "/cdn/" + version + "/img/" + (ability === kit.passive ? "passive/" : "spell/") + ability.image.full,
  }));
  const regionEntries = regions.docs.flatMap((doc) => {
    const matched = findByLabel(champions, doc.id);
    const value = doc.data().region;
    const region = typeof value === "string" ? toRegionValue(value) : null;
    return matched && region ? [{ championId: matched.id, region }] : [];
  });
  return buildPvpRounds({ ...assets, version, champions, abilities, regions: regionEntries });
};

export const regionNames = {
  "bandle-city": "Bandle City",
  bilgewater: "Bilgewater",
  demacia: "Demacia",
  freljord: "Freljord",
  ionia: "Ionia",
  ixtal: "Ixtal",
  "mt-targon": "Mt. Targon",
  noxus: "Noxus",
  piltover: "Piltover",
  "shadow-isles": "Shadow Isles",
  shurima: "Shurima",
  void: "The Void",
  zaun: "Zaun",
} as const;

export type RegionId = keyof typeof regionNames;

export const regionValues: Record<string, string> = {
  ...Object.fromEntries(Object.entries(regionNames).map(([id, name]) => [name.toLowerCase(), id])),
  targon: "mt-targon",
  void: "void",
};

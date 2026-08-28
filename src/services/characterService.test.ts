import { describe, expect, it } from "vitest";

import { ChampionDetails } from "../api/types";

import { characterService } from "./characterService";

const roster = [
  { id: "Chogath", name: "Cho'Gath" },
  { id: "MonkeyKing", name: "Wukong" },
  { id: "DrMundo", name: "Dr. Mundo" },
  { id: "Aatrox", name: "Aatrox" },
] as ChampionDetails[];

describe("findByLabel", () => {
  it("matches the data dragon id exactly", () => {
    expect(characterService.findByLabel(roster, "Aatrox")?.id).toBe("Aatrox");
  });

  it("ignores casing that differs from the id", () => {
    expect(characterService.findByLabel(roster, "ChoGath")?.id).toBe("Chogath");
  });

  it("matches the display name when it differs from the id", () => {
    expect(characterService.findByLabel(roster, "Wukong")?.id).toBe("MonkeyKing");
  });

  it("ignores punctuation and spacing", () => {
    expect(characterService.findByLabel(roster, "Cho'Gath")?.id).toBe("Chogath");
    expect(characterService.findByLabel(roster, "Dr. Mundo")?.id).toBe("DrMundo");
    expect(characterService.findByLabel(roster, "drmundo")?.id).toBe("DrMundo");
  });

  it("returns null for a champion it does not know", () => {
    expect(characterService.findByLabel(roster, "Nobody")).toBeNull();
  });
});

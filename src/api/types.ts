export type ApiResponse = {
  type: string;
  format: string;
  version: string;
  data: ApiData;
};

export type ApiData = Record<string, Character>;

export type Character = {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[];
};

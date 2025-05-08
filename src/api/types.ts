export type ApiResponse = {
    type: string;
    format: string;
    version: string;
    data: ApiData;
};

export type ApiData = Record<string, ChampionDetails>;

export type UserPrivateData = {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type UserPublicData = {
    avatar: string;
    username: string;
    totalScore: number;
}

export type ChampionDetails = {
    id: string;
    key: string;
    name: string;
    title: string;
    blurb: string;
    lore: string;
    partype: string;
    tags: string[];
    image: {
        full: string;
        sprite: string;
        group: string;
        x: number;
        y: number;
        w: number;
        h: number;
    };
    passive: {
        description: string;
        name: string;
    };
    spells: [
        {
            id: string;
            cooldown: number[];
            cooldownBurn: string;
            cost: number[];
            costBurn: string;
            description: string;
            image: {
                full: string;
            }
            tooltip: string;
            name: string;
        }
    ];
};

export interface Scores {
    gameId: string;
    score: number;
}

export enum GameState {
    NotStarted = "NotStarted",
    InProgress = "InProgress",
    Finished = "Finished",
}

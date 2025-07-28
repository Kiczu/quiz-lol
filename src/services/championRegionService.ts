import { getDocs, collection } from "firebase/firestore";

import { db } from "../api/firebase/db";
import { regions } from "../views/GameRegion/regionsData";

export type ChampionRegion = {
    name: string;
    region: string;
};

const getAll = async (): Promise<ChampionRegion[]> => {
    const colRef = collection(db, "championRegions");
    const snapshot = await getDocs(colRef);

    return snapshot.docs.map((doc) => {
        const regionName = doc.data().region;
        const matched = regions.find(
            (r) => r.name.toLowerCase() === regionName.toLowerCase()
        );
        return {
            name: doc.id,
            region: matched ? matched.value : regionName,
        };
    });
};

export const championRegionService = { getAll };

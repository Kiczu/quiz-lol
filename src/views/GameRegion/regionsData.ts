import { RegionId, regionNames } from "../../../functions/src/contracts/regions";
import bandleCityBg from "../../assets/regions/backgrounds/bandle_city.webp";
import bilgewaterBg from "../../assets/regions/backgrounds/bilgewater.webp";
import demaciaBg from "../../assets/regions/backgrounds/demacia.webp";
import freljordBg from "../../assets/regions/backgrounds/frejlord.webp";
import ioniaBg from "../../assets/regions/backgrounds/ionia.webp";
import ixtalBg from "../../assets/regions/backgrounds/ixtal.webp";
import noxusBg from "../../assets/regions/backgrounds/noxus.webp";
import piltoverBg from "../../assets/regions/backgrounds/piltover.webp";
import pustkaBg from "../../assets/regions/backgrounds/pustka.webp";
import shadowIslandBg from "../../assets/regions/backgrounds/shadow_island.webp";
import shurimaBg from "../../assets/regions/backgrounds/shurima.webp";
import targonBg from "../../assets/regions/backgrounds/targon.webp";
import zaunBg from "../../assets/regions/backgrounds/zaun.webp";
import bandleCityCrest from "../../assets/regions/icons/bandle_city_crest_icon.webp";
import bilgewaterCrest from "../../assets/regions/icons/bilgewater_crest_icon.webp";
import demaciaCrest from "../../assets/regions/icons/demacia_crest_icon.webp";
import freljordCrest from "../../assets/regions/icons/freljord_crest_icon.webp";
import ioniaCrest from "../../assets/regions/icons/iona_crest_icon.webp";
import ixtalCrest from "../../assets/regions/icons/ixtal_crest_icon.webp";
import mtTargonCrest from "../../assets/regions/icons/mt_targon_crest_icon.webp";
import noxusCrest from "../../assets/regions/icons/noxus_crest_icon.webp";
import piltoverCrest from "../../assets/regions/icons/piltover_crest_icon.webp";
import shadowIslesCrest from "../../assets/regions/icons/shadow_isles_crest_icon.webp";
import shurimaCrest from "../../assets/regions/icons/shurima_crest_icon.webp";
import voidCrest from "../../assets/regions/icons/void_crest_icon.webp";
import zaunCrest from "../../assets/regions/icons/zaun_crest_icon.webp";


export type Region = {
    name: string;
    value: RegionId;
    crest: string;
    background: string;
};

const regionAssets: Omit<Region, "name">[] = [
    {
        value: "bandle-city",
        crest: bandleCityCrest,
        background: bandleCityBg,
    },
    {
        value: "bilgewater",
        crest: bilgewaterCrest,
        background: bilgewaterBg,
    },
    {
        value: "demacia",
        crest: demaciaCrest,
        background: demaciaBg,
    },
    {
        value: "freljord",
        crest: freljordCrest,
        background: freljordBg,
    },
    {
        value: "ionia",
        crest: ioniaCrest,
        background: ioniaBg,
    },
    {
        value: "ixtal",
        crest: ixtalCrest,
        background: ixtalBg,
    },
    {
        value: "mt-targon",
        crest: mtTargonCrest,
        background: targonBg,
    },
    {
        value: "noxus",
        crest: noxusCrest,
        background: noxusBg,
    },
    {
        value: "piltover",
        crest: piltoverCrest,
        background: piltoverBg,
    },
    {
        value: "shadow-isles",
        crest: shadowIslesCrest,
        background: shadowIslandBg,
    },
    {
        value: "shurima",
        crest: shurimaCrest,
        background: shurimaBg,
    },
    {
        value: "void",
        crest: voidCrest,
        background: pustkaBg,
    },
    {
        value: "zaun",
        crest: zaunCrest,
        background: zaunBg,
    },
];

export const regions: Region[] = regionAssets.map((region) => ({
    ...region,
    name: regionNames[region.value],
}));

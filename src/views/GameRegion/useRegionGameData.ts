import useGameRound from "../../hooks/useGameRound";
import { RegionRound } from "../../services/gameRoundService";

import { regions } from "./regionsData";

const useRegionGameData = () => {
    const game = useGameRound<RegionRound>("Regions");
    return { ...game, regions, usedRegions: game.used, handleSelectRegion: game.submitGuess };
};

export default useRegionGameData;

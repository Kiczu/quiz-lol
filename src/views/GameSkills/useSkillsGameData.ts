import useGameRound from "../../hooks/useGameRound";
import { SkillRound } from "../../services/gameRoundService";

const useSkillsGameData = () => {
    const game = useGameRound<SkillRound>("Skills");
    return { ...game, usedChampions: game.used, handleSelectChampion: game.submitGuess };
};

export default useSkillsGameData;

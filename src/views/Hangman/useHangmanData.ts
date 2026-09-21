import useGameRound from "../../hooks/useGameRound";
import { HangmanRound } from "../../services/gameRoundService";

const useHangmanData = () => {
    const game = useGameRound<HangmanRound>("Hangman");
    return {
        ...game,
        mask: game.result?.mask ?? game.round?.mask ?? [],
        usedLetters: game.used,
        userGuess: game.submitGuess,
    };
};

export default useHangmanData;

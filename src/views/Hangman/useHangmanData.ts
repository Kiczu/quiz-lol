import { useContext, useEffect, useState } from "react";
import { ChampionDetails } from "../../api/types";
import { characterService } from '../../services/characterService';
import { GameContext } from '../../context/GameContext/GameContext';

const maxAttempts = 6;
const winBonus = 10;

const useHangmanData = () => {
    const [data, setData] = useState<null | ChampionDetails[]>(null);
    const [letters, setLetters] = useState<{ isCorrect: boolean, value: string }[]>([]);
    const [wrongGuesses, setWrongGuesses] = useState<number>(0);
    const [inputLetter, setInputLetter] = useState<string>("");
    const [points, setPoints] = useState<number>(0);
    const [usedLetters, setUsedLetters] = useState<string[]>([]);

    const hangmanContext = useContext(GameContext);
    const isGameOver = wrongGuesses === maxAttempts;
    const isAllAnswerCorrect =
        letters.length > 0 &&
        letters
            .filter(({ value }) => /[A-Z]/.test(value))
            .every(({ isCorrect }) => isCorrect);

    useEffect(() => {
        characterService.getAll().then(setData);
    }, []);

    useEffect(() => {
        if (data) {
            const randomCharacter = data[Math.floor(Math.random() * data.length)];
            setLetters(
                randomCharacter.name
                    .split('').map((letter) => ({ isCorrect: false, value: letter.toUpperCase() }))
            );
        }
    }, [data]);

    useEffect(() => {
        if (isGameOver) {
            hangmanContext?.handleEndGame(points, false);
        } else if (isAllAnswerCorrect) {
            hangmanContext?.handleEndGame(points + winBonus, true);
        }
    }, [wrongGuesses, letters, hangmanContext, isGameOver, isAllAnswerCorrect, points]);

    const changeLetter = (letter: string) => {
        setLetters((prevLetters) => prevLetters.map((item) => {
            if (item.value === letter) {
                return { ...item, isCorrect: true };
            }
            return item;
        }))
    }

    const handleLetterChange = (letter: string) => {
        setInputLetter(letter);
    }

    const userGuess = (letter: string) => {
        if (!usedLetters.includes(letter)) {
            setUsedLetters([...usedLetters, letter]);
        }
        const isCorrect = letters.some(({ value }) => value === letter);
        if (isCorrect) {
            changeLetter(letter);
            setPoints((prevPoints) => prevPoints + 1);
        } else {
            userWrongGuess();
        }
        setInputLetter("");
    };

    const resetWrongGuesses = () => {
        setWrongGuesses(0);
        setLetters(letters.map(({ value }) => ({ isCorrect: false, value })));
    };

    const userWrongGuess = () => {
        setWrongGuesses((prevWrongGuesses) => prevWrongGuesses + 1);
    };

    return { inputLetter, letters, wrongGuesses, maxAttempts, usedLetters, changeLetter, handleLetterChange, userGuess, resetWrongGuesses };
}

export default useHangmanData;

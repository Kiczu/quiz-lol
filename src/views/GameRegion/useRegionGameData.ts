import { useContext, useEffect, useState } from "react";

import { GameContext } from "../../context/GameContext/GameContext";
import { championRegionService, ChampionRegion } from "../../services/championRegionService";
import { characterService } from "../../services/characterService";

import { regions } from "./regionsData";

const maxAttempts = 3;

const useRegionGameData = () => {
    const [champions, setChampions] = useState<ChampionRegion[] | null>(null);
    const [championToGuess, setChampionToGuess] = useState<ChampionRegion | null>(null);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [usedRegions, setUsedRegions] = useState<string[]>([]);
    const [isGameEnded, setIsGameEnded] = useState(false);
    const [championImage, setChampionImage] = useState<string | undefined>(undefined);
    const [version, setVersion] = useState<string | null>(null);

    const {
        handleEndGame,
        handleStartGame,
        startNewGame,
    } = useContext(GameContext);

    useEffect(() => {
        startNewGame("region");
        handleStartGame();
         
    }, []);

    useEffect(() => {
        const fetchChampions = async () => {
            const [data, patch] = await Promise.all([
                championRegionService.getAll(),
                characterService.getVersion(),
            ]);
            setChampions(data);
            setVersion(patch);
        };
        fetchChampions();
    }, []);

    useEffect(() => {
        if (champions && champions.length > 0) {
            pickRandomChampion();
        }
         
    }, [champions]);

    const pickRandomChampion = () => {
        if (!champions || champions.length === 0) return;
        const random = champions[Math.floor(Math.random() * champions.length)];
        setChampionToGuess(random);
        setChampionImage(version ? characterService.getImageUrl(random.name, version) : undefined);
        setWrongGuesses(0);
        setUsedRegions([]);
        setIsGameEnded(false);
    };

    const getPoints = (wrongGuesses: number) => {
        if (wrongGuesses === 0) return 10;
        if (wrongGuesses === 1) return 6;
        if (wrongGuesses === 2) return 3;
        return 0;
    };

    const handleSelectRegion = (selected: string) => {
        if (!championToGuess || isGameEnded) return;
        if (usedRegions.includes(selected)) return;

        setUsedRegions((prev) => [...prev, selected]);

        if (selected === championToGuess.region) {
            const points = getPoints(wrongGuesses);
            setIsGameEnded(true);
            handleEndGame(points, true);
            return;
        }

        const newWrong = wrongGuesses + 1;
        setWrongGuesses(newWrong);
        if (newWrong >= maxAttempts) {
            setIsGameEnded(true);
            handleEndGame(0, false);
        }
    };



    const isCorrect = championToGuess && usedRegions.includes(championToGuess.region);
    const isGameOver = wrongGuesses >= maxAttempts;

    return {
        regions,
        championToGuess,
        wrongGuesses,
        maxAttempts,
        isCorrect,
        isGameOver,
        isGameEnded,
        usedRegions,
        championImage,
        handleSelectRegion,
        pickRandomChampion, // jeśli chcesz pozwolić grać ponownie bez reloadu
    };
};

export default useRegionGameData;

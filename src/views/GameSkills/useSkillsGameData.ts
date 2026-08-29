import { useCallback, useContext, useEffect, useState } from "react";

import { ChampionDetails } from "../../api/types";
import { GameContext } from "../../context/GameContext/GameContext";
import { characterService } from "../../services/characterService";
import { shuffle } from "../../utils/array";
import { randomNumberTo } from "../../utils/number";

const maxAttempts = 3;
const optionsPerRound = 4;

export type ChampionOption = {
    id: string;
    name: string;
    icon: string;
};

type SkillRound = {
    spellName: string;
    spellIcon: string;
    answerId: string;
    options: ChampionOption[];
};

const getPoints = (wrongGuesses: number) => {
    if (wrongGuesses === 0) return 10;
    if (wrongGuesses === 1) return 6;
    if (wrongGuesses === 2) return 3;
    return 0;
};

const useSkillsGameData = () => {
    const [round, setRound] = useState<SkillRound | null>(null);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [usedChampions, setUsedChampions] = useState<string[]>([]);
    const [isRoundOver, setIsRoundOver] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const { handleEndGame } = useContext(GameContext);

    const startRound = useCallback(async () => {
        setIsLoading(true);
        setHasError(false);

        try {
            const [champions, version] = await Promise.all([
                characterService.getAll(),
                characterService.getVersion(),
            ]);

            const answer = champions[randomNumberTo(champions.length)];
            const details = await characterService.getChampion(answer.id);
            const spell = details.spells[randomNumberTo(details.spells.length)];

            const toOption = (champion: ChampionDetails): ChampionOption => ({
                id: champion.id,
                name: champion.name,
                icon: characterService.getImageUrl(champion.id, version),
            });

            const distractors = shuffle(
                champions.filter((champion) => champion.id !== answer.id)
            ).slice(0, optionsPerRound - 1);

            setRound({
                spellName: spell.name,
                spellIcon: characterService.getSpellImageUrl(spell.image.full, version),
                answerId: answer.id,
                options: shuffle([answer, ...distractors]).map(toOption),
            });
            setWrongGuesses(0);
            setUsedChampions([]);
            setIsRoundOver(false);
        } catch (error) {
            console.error(error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        startRound();
    }, [startRound]);

    const handleSelectChampion = (championId: string) => {
        if (!round || isRoundOver || usedChampions.includes(championId)) return;

        setUsedChampions((used) => [...used, championId]);

        if (championId === round.answerId) {
            setIsRoundOver(true);
            handleEndGame(getPoints(wrongGuesses), true);
            return;
        }

        const nextWrong = wrongGuesses + 1;
        setWrongGuesses(nextWrong);

        if (nextWrong >= maxAttempts) {
            setIsRoundOver(true);
            handleEndGame(0, false);
        }
    };

    return {
        round,
        wrongGuesses,
        maxAttempts,
        usedChampions,
        isLoading,
        hasError,
        handleSelectChampion,
        startRound,
    };
};

export default useSkillsGameData;

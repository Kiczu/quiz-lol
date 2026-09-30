import { useCallback, useEffect, useState } from "react";

import { ChampionDetails } from "../../api/types";
import { characterService } from "../../services/characterService";

export const useLoreData = () => {
  const [champions, setChampions] = useState<ChampionDetails[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchChampions = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setChampions(await characterService.getAll());
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChampions();
  }, [fetchChampions]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const filterChampions = (champions: ChampionDetails[]) => {
    return champions.filter((champion) =>
      champion.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  const visibleChampions = filterChampions(champions);

  return {
    champions: visibleChampions,
    search,
    isLoading,
    hasError,
    handleSearchChange,
    retry: fetchChampions,
  };
};

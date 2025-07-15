import { useEffect, useState } from "react";

import { ChampionDetails } from "../../api/types";
import { characterService } from "../../services/characterService";

export const useLoreData = () => {
  const [champions, setChampions] = useState<ChampionDetails[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const data = await characterService.getAll();
        setChampions(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchChampions();
  }, []);

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
    handleSearchChange,
  };
};
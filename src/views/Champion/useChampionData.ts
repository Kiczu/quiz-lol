import { useEffect, useState } from "react";

import { ChampionDetails } from "../../api/types";
import { characterService } from "../../services/characterService";

export const useChampionData = (id?: string) => {
  const [champion, setChampion] = useState<ChampionDetails | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    // Guards against a slower request for a previous champion overwriting a
    // newer one when the id changes mid-flight.
    let ignore = false;

    const fetchChampion = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const [data, patch] = await Promise.all([
          characterService.getChampion(id),
          characterService.getVersion(),
        ]);
        if (!ignore) {
          setChampion(data ?? null);
          setVersion(patch);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setChampion(null);
          setHasError(true);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchChampion();

    return () => {
      ignore = true;
    };
  }, [id]);

  return { champion, version, isLoading, hasError };
};

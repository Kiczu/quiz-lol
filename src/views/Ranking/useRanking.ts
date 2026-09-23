import { useEffect, useState } from "react";

import { LeaderboardEntry, scoreService } from "../../services/scoreService";

const useRanking = (selectedGameMode: string) => {
    const [ranking, setRanking] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        let active = true;
        setRanking([]);
        scoreService.getLeaderboard(selectedGameMode)
            .then((entries) => { if (active) setRanking(entries); })
            .catch(() => { if (active) setRanking([]); });
        return () => { active = false; };
    }, [selectedGameMode]);

    return { ranking };
};

export default useRanking;

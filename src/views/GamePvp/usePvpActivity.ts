import { useEffect, useState } from "react";

import { pvpRules } from "../../../functions/src/contracts/pvp";
import { PvpActivity, pvpService } from "../../services/pvpService";

const usePvpActivity = (enabled: boolean) => {
    const [activity, setActivity] = useState<PvpActivity | null>(null);

    useEffect(() => {
        if (!enabled) return;
        let active = true;
        let timer: ReturnType<typeof setTimeout>;
        const poll = async () => {
            try {
                const result = await pvpService.getActivity();
                if (active) setActivity(result.data);
            } catch {
                if (active) setActivity(null);
            } finally {
                if (active) timer = setTimeout(poll, pvpRules.activityPollInterval);
            }
        };
        void poll();
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [enabled]);

    return enabled ? activity : null;
};

export default usePvpActivity;

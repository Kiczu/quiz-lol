import { useEffect, useState } from "react";

import { pvpRules } from "../../../functions/src/contracts/pvp";
import { pvpService } from "../../services/pvpService";

const usePvpPresence = (code: string, enabled: boolean) => {
    const [error, setError] = useState("");
    useEffect(() => {
        setError("");
        if (!enabled || !code) return;
        let active = true;
        let timer: ReturnType<typeof setTimeout>;
        const pulse = async () => {
            try {
                await pvpService.heartbeat({ code });
                if (active) setError("");
            } catch {
                if (active) setError(`Connection interrupted. Reconnect within ${pvpRules.reconnectWindow / 1000} seconds to avoid a forfeit.`);
            } finally {
                if (active) timer = setTimeout(pulse, pvpRules.heartbeatInterval);
            }
        };
        void pulse();
        return () => { active = false; clearTimeout(timer); };
    }, [code, enabled]);
    return error;
};

export default usePvpPresence;

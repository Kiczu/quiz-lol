import { useEffect, useState } from "react";

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
                if (active) setError("Connection interrupted. Reconnect within 60 seconds to avoid a forfeit.");
            } finally {
                if (active) timer = setTimeout(pulse, 15_000);
            }
        };
        void pulse();
        return () => { active = false; clearTimeout(timer); };
    }, [code, enabled]);
    return error;
};

export default usePvpPresence;

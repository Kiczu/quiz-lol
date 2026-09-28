import { useEffect, useRef, useState } from "react";

import { PvpSearchResult, pvpService } from "../../services/pvpService";

const useMatchmaking = (uid: string | undefined, onMatched: (code: string) => void) => {
    const [searchId, setSearchId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [cancelling, setCancelling] = useState(false);
    const activeSearch = useRef<string | null>(null);
    const onMatchedRef = useRef(onMatched);
    onMatchedRef.current = onMatched;

    useEffect(() => {
        if (!searchId || !uid) return;
        activeSearch.current = searchId;
        let active = true;
        let timer: ReturnType<typeof setTimeout>;
        const receive = (result: PvpSearchResult) => {
            if (!active) return;
            if (result.state === "matched" && result.code) {
                active = false;
                setSearchId(null);
                setError("");
                onMatchedRef.current(result.code);
            } else if (result.state === "cancelled") {
                active = false;
                setSearchId(null);
            }
        };
        const poll = async () => {
            try {
                const result = await pvpService.findMatch({ searchId });
                if (active) setError("");
                receive(result.data);
            } catch (cause) {
                if (!active) return;
                if ((cause as { code?: string }).code === "functions/already-exists") {
                    setError("A search is already active. Cancel it in the other window or wait up to 45 seconds after closing it.");
                    setSearchId(null);
                    active = false;
                } else {
                    setError("Search interrupted. Reconnecting automatically…");
                }
            } finally {
                if (active) timer = setTimeout(poll, 10_000);
            }
        };
        const unsubscribe = pvpService.watchSearch(uid, (ticket) => {
            if (ticket.searchId === searchId) receive(ticket);
        }, () => {
            if (active) setError("Connection interrupted. Retrying the search…");
        });
        void poll();
        return () => {
            active = false;
            activeSearch.current = null;
            clearTimeout(timer);
            unsubscribe();
            void pvpService.cancelSearch({ searchId }).catch(() => {});
        };
    }, [uid, searchId]);

    const start = () => {
        if (!uid || searchId) return;
        setError("");
        setSearchId(crypto.randomUUID());
    };

    const cancel = async () => {
        if (!searchId || cancelling) return;
        setCancelling(true);
        try {
            const result = await pvpService.cancelSearch({ searchId });
            if (activeSearch.current !== searchId) return;
            if (result.data.state === "matched" && result.data.code) onMatchedRef.current(result.data.code);
            setSearchId(null);
            setError("");
        } catch {
            if (activeSearch.current === searchId) setError("Could not cancel yet. Check your connection and try again.");
        } finally {
            setCancelling(false);
        }
    };

    return { searching: searchId !== null, error, cancelling, start, cancel };
};

export default useMatchmaking;

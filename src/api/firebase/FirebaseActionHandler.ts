import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, applyActionCode } from "firebase/auth";

const FirebaseActionHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const mode = params.get("mode");
        const oobCode = params.get("oobCode");
        const auth = getAuth();

        if (mode === "verifyEmail" && oobCode) {
            applyActionCode(auth, oobCode)
                .then(() => {
                    navigate("/auth/login");
                })
                .catch(() => {
                    navigate("/auth/login");
                });
        }
    }, [location, navigate]);

    return null;
};

export default FirebaseActionHandler;

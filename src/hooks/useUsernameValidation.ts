import { useState } from "react";
import { userService } from "../services/userService";

export const useUsernameValidation = (currentUsername?: string) => {
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);

    const validateUsername = async (value: string) => {
        if (!value) {
            setUsernameError("Username is required");
            return false;
        }
        if (value === currentUsername) {
            setUsernameError(null);
            return true;
        }
        setCheckingUsername(true);
        const exists = await userService.isUsernameTaken(value);
        setCheckingUsername(false);
        if (exists) {
            setUsernameError("Username is already taken");
            return false;
        }
        setUsernameError(null);
        return true;
    };

    return { usernameError, checkingUsername, validateUsername, setUsernameError };
};

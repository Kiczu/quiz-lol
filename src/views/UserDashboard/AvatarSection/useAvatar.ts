import { userService } from "../../../services/userService";
import { useAuth } from "../../../context/LoginContext/LoginContext";

export const useAvatar = () => {
    const { userData, refreshUserData } = useAuth();

    const updateAvatar = async (avatarPath: string) => {
        if (userData?.uid) {
            await userService.updateUserAvatar(userData.uid, avatarPath);
            await refreshUserData();
        }
    };

    return { updateAvatar };
};

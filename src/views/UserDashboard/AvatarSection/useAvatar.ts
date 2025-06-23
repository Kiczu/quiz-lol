import { useAuth } from "../../../context/LoginContext/LoginContext";
import { scoreService } from "../../../services/scoreService";

export const useAvatar = () => {
    const { userData, refreshUserData } = useAuth();

    const updateAvatar = async (avatarPath: string) => {
        if (userData?.uid) {
            await scoreService.updateUserAvatar(userData.uid, avatarPath);
            await refreshUserData();
        }
    };

    return { updateAvatar };
};

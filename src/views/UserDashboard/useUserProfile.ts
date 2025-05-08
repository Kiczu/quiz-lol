import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import { useAuth } from "../../context/LoginContext/LoginContext";

export const useUserProfile = () => {
    const { userData, updateUsername, refreshUserData } = useAuth();
    const [isUsernameEditable, setIsUsernameEditable] = useState(!userData?.username);
    const [formData, setFormData] = useState({
        username: userData?.username || "",
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        email: userData?.email || "",
    });

    useEffect(() => {
        if (!userData) return;

        setFormData({
            username: userData.username || "",
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
        });
        setIsUsernameEditable(!userData.username);
    }, [userData]);

    const updateUserProfile = async () => {
        if (!userData) return;

        try {
            await userService.updateUserData(userData.uid, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
            });

            if (!userData.username && formData.username) {
                await updateUsername(formData.username);
                setIsUsernameEditable(false);
            }

            await refreshUserData();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return { formData, setFormData, updateUserProfile, isUsernameEditable };
};

export default useUserProfile;
import { doc, getDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updatePassword, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { db } from "../api/firebase/db"; 
import { UserDataResponseRegister } from "../api/types";
import { scoreService } from "./scoreService";

const createUser = async ({ id, username, ...userData }: any) => {
    await setDoc(doc(db, "users", id), userData);
    await setDoc(doc(db, "leaderboards", id), { username: username, totalScore: 0 });
};

const getUserData = async (id: string) => {
    const userDoc = await getDoc(doc(db, "users", id));
    if (!userDoc.exists()) return null;

    const userDataFromFirestore = userDoc.data() as UserDataResponseRegister;

    const leaderboardData = await getUserLeaderboardData(id);
    const userScores = await scoreService.getUserScores(id);

    return {
        uid: id,
        username: leaderboardData?.username || "Unknown",
        avatar: userDataFromFirestore.avatar || "/default-avatar.png",
        firstName: userDataFromFirestore.firstName,
        lastName: userDataFromFirestore.lastName,
        email: userDataFromFirestore.email,
        totalScore: leaderboardData?.totalScore || 0,
        scores: userScores,
    };
};

const getUserLeaderboardData = async (userId: string) => {
    const leaderboardDoc = await getDoc(doc(db, "leaderboard", userId));
    if (!leaderboardDoc.exists()) return null;

    return {
        username: leaderboardDoc.data()?.username || "Unknown",
        totalScore: leaderboardDoc.data()?.totalScore || 0,
    };
};

const updateUserData = async (userId: string, data: Record<string, any>) => {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, data);
};

const updateUserAvatar = async (userId: string, avatarPath: string) => {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, { avatar: avatarPath });
};

const uploadUserAvatar = async (userId: string, file: File): Promise<string> => {
    const storage = getStorage();
    const avatarRef = ref(storage, `avatars/${userId}_${file.name}`);

    await uploadBytes(avatarRef, file);

    const downloadURL = await getDownloadURL(avatarRef);
    return downloadURL;
};

const deleteUser = async (userId: string) => {
    if (!userId) return;

    await deleteDoc(doc(db, "users", userId));
    await deleteDoc(doc(db, "scores", userId));

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");

    await user.delete();
};

const changeUserPassword = async (newPassword: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        await updatePassword(user, newPassword);
    } else {
        throw new Error("No user is logged in.");
    }
};

const handlePasswordChange = async ({
    newPassword,
    confirmPassword,
}: {
    newPassword: string;
    confirmPassword: string;
}): Promise<string> => {
    if (newPassword !== confirmPassword) {
        return "Passwords do not match!";
    }

    try {
        await changeUserPassword(newPassword);
        return "Password updated successfully!";
    } catch (error: any) {
        if (error.code === "auth/requires-recent-login") {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    const provider = new GoogleAuthProvider();
                    await reauthenticateWithPopup(user, provider);
                    await changeUserPassword(newPassword);
                    return "Password updated successfully!";
                } else {
                    throw new Error("No user is logged in.");
                }
            } catch (reauthError) {
                console.error("Reauthentication failed:", reauthError);
                return "Reauthentication required. Please log in again.";
            }
        }
        console.error("Error updating password:", error);
        return "Failed to update password.";
    }
};

const handleUserProfileUpdate = async (
    userId: string,
    formData: Record<string, string>
) => {
    try {
        await updateUserData(userId, formData);
        return "User information updated successfully!";
    } catch (error) {
        console.error("Error updating user data:", error);
        return "Failed to update user information.";
    }
};


export const userService = {
    createUser,
    getUserData,
    changeUserPassword,
    updateUserData,
    deleteUser,
    handlePasswordChange,
    handleUserProfileUpdate,
    updateUserAvatar,
    uploadUserAvatar,
};

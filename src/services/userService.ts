import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { EditableUserFields } from "../api/types";
import { db } from "../api/firebase/db";
import { auth } from "../api/firebase/auth";
import { scoreService } from "./scoreService";

interface CreateUserData {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
}

const createUser = async ({
    uid,
    email,
    firstName,
    lastName,
    username,
}: CreateUserData) => {
    await setDoc(doc(db, "users", uid), {
        email,
        firstName,
        lastName,
    });
    if (username) {
        await setDoc(doc(db, "scores", uid), { username, avatar: "/default-avatar.png", totalScore: 0 });
    }
};

const getUserData = async (id: string) => {
    const userDoc = await getDoc(doc(db, "users", id));
    if (!userDoc.exists()) return null;

    const userDataFromFirestore = userDoc.data();

    const userScores = await scoreService.getUserScores(id);
    const scoresDoc = await getDoc(doc(db, "scores", id));
    const scoreData = scoresDoc.exists() ? scoresDoc.data() : { username: "", totalScore: 0 };

    return {
        uid: id,
        username: scoreData?.username || "",
        avatar: userDataFromFirestore.avatar || "/default-avatar.png",
        firstName: userDataFromFirestore.firstName,
        lastName: userDataFromFirestore.lastName,
        email: userDataFromFirestore.email,
        totalScore: scoreData?.totalScore || 0,
        scores: userScores,
    };
};

const updateUserData = async (uid: string, updates: EditableUserFields) => {
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, updates);
};

const updateUserAvatar = async (userId: string, avatarPath: string) => {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, { avatar: avatarPath });
};

const deleteUser = async (userId: string) => {
    if (!userId) return;

    await deleteDoc(doc(db, "users", userId));
    await deleteDoc(doc(db, "scores", userId));

    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");

    await user.delete();
};

export const userService = {
    createUser,
    getUserData,
    updateUserData,
    updateUserAvatar,
    deleteUser,
};

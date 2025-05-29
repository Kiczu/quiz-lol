import { doc, getDoc, setDoc, updateDoc, deleteDoc, query, collection, getDocs, where } from "firebase/firestore";
import { EditableUserFields, RawUserData, UserPrivateData, UserPublicData } from "../api/types";
import { db } from "../api/firebase/db";
import { auth } from "../api/firebase/auth";

interface CreateUserData {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
}

const createUser = async ({
    uid,
    email,
    firstName,
    lastName,
    username,
    avatar = "/default-avatar.png",
}: CreateUserData) => {
    await setDoc(doc(db, "users", uid), {
        email,
        firstName,
        lastName,
    });
    await setDoc(doc(db, "scores", uid), {
        username,
        avatar: avatar,
        scores: {},
        totalScore: 0,
    });
};

const getUserData = async (uid: string): Promise<RawUserData | null> => {
    const privateSnap = await getDoc(doc(db, "users", uid));
    const publicSnap = await getDoc(doc(db, "scores", uid));

    if (!privateSnap.exists() || !publicSnap.exists()) return null;

    const privateData = privateSnap.data();
    const publicData = publicSnap.data();

    return {
        uid: uid,
        ...privateData,
        ...publicData,
    };
};

const updateUserData = async (uid: string, updates: EditableUserFields) => {
    const privateRef = doc(db, "users", uid);
    const publicRef = doc(db, "scores", uid);

    const privateSnap = await getDoc(privateRef);
    const publicSnap = await getDoc(publicRef);

    if (!privateSnap.exists() || !publicSnap.exists()) return;

    const privateData = privateSnap.data() as UserPrivateData;
    const publicData = publicSnap.data() as UserPublicData;

    const privateUpdates: Partial<UserPrivateData> = {};
    const publicUpdates: Partial<UserPublicData> = {};

    if (updates.firstName !== undefined && updates.firstName !== privateData.firstName)
        privateUpdates.firstName = updates.firstName;

    if (updates.lastName !== undefined && updates.lastName !== privateData.lastName)
        privateUpdates.lastName = updates.lastName;

    if (updates.email !== undefined && updates.email !== privateData.email)
        privateUpdates.email = updates.email;

    if (updates.username !== undefined && updates.username !== publicData.username)
        publicUpdates.username = updates.username;

    if (Object.keys(privateUpdates).length > 0) {
        await updateDoc(privateRef, privateUpdates);
    }

    if (Object.keys(publicUpdates).length > 0) {
        await updateDoc(publicRef, publicUpdates);
    }
};

const isUsernameTaken = async (username: string): Promise<boolean> => {
    const q = query(collection(db, "scores"), where("username", "==", username));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
};
const updateUserAvatar = async (uid: string, avatarPath: string) => {
    const userDoc = doc(db, "scores", uid);
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
    isUsernameTaken,
};

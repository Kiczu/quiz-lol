import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { EditableUserFields, UserPrivateData, } from "../api/types";
import { db } from "../api/firebase/db";
import { filterEmptyFields } from "../utils/object";

const createUserPrivate = async ({
    uid,
    email,
    firstName,
    lastName,
}: {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
}) => {
    await setDoc(doc(db, "users", uid), {
        email,
        firstName,
        lastName,
    });
};

const getUserPrivate = async (uid: string): Promise<UserPrivateData | null> => {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as UserPrivateData) : null;
};

const updateUserPrivate = async (uid: string, updates: EditableUserFields) => {
    const filtered = filterEmptyFields(updates);
    if (Object.keys(filtered).length > 0) {
        await updateDoc(doc(db, "users", uid), filtered);
    }
};
const deleteUserPrivate = async (uid: string) => {
    await deleteDoc(doc(db, "users", uid));
};

export const userService = {
    createUserPrivate,
    getUserPrivate,
    updateUserPrivate,
    deleteUserPrivate,
};

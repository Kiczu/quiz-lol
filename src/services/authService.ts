import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, updatePassword, sendPasswordResetEmail, EmailAuthProvider, linkWithCredential, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../api/firebase/auth";
import { userAggregateService } from "./userAggregateService";

const getCurrentUser = () => {
    return auth.currentUser;
}

const onAuthStateChanged = (callback: (user: any) => void) => {
    return auth.onAuthStateChanged(callback);
}

const registerUser = async (email: string, password: string, userData: { username: string, firstName: string; lastName: string; }) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const { user } = userCredential;

        await userAggregateService.createUser({
            uid: user.uid,
            username: userData.username,
            email: user.email!,
            firstName: userData.firstName,
            lastName: userData.lastName,
        });

        return user;
    } catch (error: any) {
        throw error;
    }
}
const setPasswordForGoogleUser = async (email: string, password: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently logged in.");

    const credential = EmailAuthProvider.credential(email, password);
    await linkWithCredential(user, credential);
}

const updateUserPassword = async (newPassword: string, currentPassword?: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("User not authenticated");

    try {
        await updatePassword(user, newPassword);
    } catch (error: any) {
        if (error.code === "auth/requires-recent-login") {
            if (!currentPassword) {
                throw error;
            }
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
        } else {
            throw error;
        }
    }
};

const sendResetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return "Password reset email sent.";
    } catch (error: any) {
        throw error;
    }
}

const loginUser = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
}

const logoutUser = async () => {
    await signOut(auth);
}


export const authService = {
    getCurrentUser,
    onAuthStateChanged,
    registerUser,
    setPasswordForGoogleUser,
    updateUserPassword,
    sendResetPassword,
    loginUser,
    signInWithGoogle,
    logoutUser,
};

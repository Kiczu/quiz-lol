import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, reauthenticateWithPopup, updatePassword, sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { userService } from "./userService";
import { auth } from "../api/firebase/auth";

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

        await userService.createUser({
            uid: user.uid,
            username: userData.username,
            email: user.email!,
            firstName: userData.firstName,
            lastName: userData.lastName,
        });

        return user;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}

const changePassword = async (newPassword: string) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user is currently logged in.");

        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
        await updatePassword(user, newPassword);

        return "Password changed successfully.";
    } catch (error: any) {
        if (error.code === "auth/requires-recent-login") {
            return "Reauthentication required. Please log in again.";
        }
        console.error("Error updating password:", error);
        return "Failed to update password.";
    }
}

const sendResetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return "Password reset email sent.";
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return "Failed to send password reset email.";
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

const reauthenticateUser = async (password?: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const providerId = user?.providerData[0]?.providerId;

    if (providerId === "password") {
        if (!password) throw new Error("Password is required for reauthentication.");
        const credential = EmailAuthProvider.credential(user.email!, password);
        return reauthenticateWithCredential(user, credential);
    }

    if (providerId === "google.com") {
        const provider = new GoogleAuthProvider();
        return reauthenticateWithPopup(user, provider);
    }

    throw new Error("Unsupported authentication method.");
};

export const authService = {
    getCurrentUser,
    onAuthStateChanged,
    registerUser,
    changePassword,
    sendResetPassword,
    loginUser,
    signInWithGoogle,
    logoutUser,
    reauthenticateUser,
};

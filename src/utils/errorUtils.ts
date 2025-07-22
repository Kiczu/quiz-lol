import { FirebaseError } from "firebase/app";

export function isFirebaseCode(error: unknown, code: string): boolean {
    return (
        error instanceof FirebaseError &&
        error.code === code
    );
}

export function isPopupClosedError(error: unknown): boolean {
    return (
        error instanceof FirebaseError &&
        error.code === "auth/popup-closed-by-user"
    ) || (
            error instanceof Error &&
            error.message?.toLowerCase().includes("popup closed")
        );
}

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case "auth/user-not-found":
                return "User not found.";
            case "auth/wrong-password":
                return "Incorrect password.";
            case "auth/email-already-in-use":
                return "This email is already in use.";
            case "auth/requires-recent-login":
                return "Please sign in again to change your email address.";
            case "auth/popup-closed-by-user":
                return "You cancelled Google authentication. The operation was aborted.";
            default:
                return error.message;
        }
    }
    if (error instanceof Error) {
        if (error.message?.toLowerCase().includes("popup closed")) {
            return "You cancelled authentication. The operation was aborted.";
        }
        return error.message;
    }
    return "Unknown error occurred.";
};

import { FirebaseError } from "firebase/app";

export function isFirebaseCode(error: unknown, code: string): boolean {
  return (
    error instanceof FirebaseError &&
    error.code === code
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
            default:
                return error.message;
        }
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Unknown error occurred.";
};

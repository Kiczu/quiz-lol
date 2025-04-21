import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const auth = getAuth();
export const provider = new GoogleAuthProvider();

import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { firebaseApp } from "./firebaseApp";

export const auth = getAuth(firebaseApp);
export const provider = new GoogleAuthProvider();

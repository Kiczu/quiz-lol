import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./firebseApp";

export const db = getFirestore(firebaseApp);
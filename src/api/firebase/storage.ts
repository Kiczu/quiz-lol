import { getStorage } from "firebase/storage";
import { firebaseApp } from "./firebseApp";

export const storage = getStorage(firebaseApp);

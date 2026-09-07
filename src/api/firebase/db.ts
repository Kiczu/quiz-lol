import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

import { emulatorHost, emulatorPorts, isEmulated } from "./emulators";
import { firebaseApp } from "./firebaseApp";

export const db = getFirestore(firebaseApp);

if (isEmulated) {
    connectFirestoreEmulator(db, emulatorHost, emulatorPorts.firestore);
}

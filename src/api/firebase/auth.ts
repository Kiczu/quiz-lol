import { connectAuthEmulator, getAuth, GoogleAuthProvider } from "firebase/auth";

import { emulatorHost, emulatorPorts, isEmulated } from "./emulators";
import { firebaseApp } from "./firebaseApp";

export const auth = getAuth(firebaseApp);
export const provider = new GoogleAuthProvider();

if (isEmulated) {
    connectAuthEmulator(auth, `http://${emulatorHost}:${emulatorPorts.auth}`, {
        disableWarnings: true,
    });
}

import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

import { emulatorHost, emulatorPorts, isEmulated } from "./emulators";
import { firebaseApp } from "./firebaseApp";

export const functions = getFunctions(firebaseApp, "europe-west1");

if (isEmulated) {
    connectFunctionsEmulator(functions, emulatorHost, emulatorPorts.functions);
}

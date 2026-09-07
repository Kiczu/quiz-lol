export const isEmulated =
    import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS !== "false";

export const emulatorHost = "127.0.0.1";

export const emulatorPorts = {
    auth: 9099,
    firestore: 8080,
    functions: 5001,
};

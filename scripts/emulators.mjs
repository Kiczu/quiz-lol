import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const root = new URL("../", import.meta.url);
const dataDir = ".emulator-data";

const readJson = async (name) => JSON.parse(await readFile(new URL(name, root), "utf8"));

const config = await readJson("firebase.json");
const projects = await readJson(".firebaserc");

const projectId = projects.projects.default;
const port = config.emulators?.firestore?.port ?? 8080;

const args = ["emulators:start", "--only", "auth,firestore,functions", "--export-on-exit", dataDir];

if (existsSync(new URL(dataDir, root))) {
    args.splice(1, 0, "--import", dataDir);
} else {
    console.log(`No ${dataDir} yet, starting from an empty database.`);
}

const firebaseCli = createRequire(import.meta.url).resolve("firebase-tools/lib/bin/firebase.js");
const emulators = spawn(process.execPath, [firebaseCli, ...args], { stdio: "inherit" });

emulators.on("error", (error) => {
    console.error(error.message);
    process.exitCode = 1;
});

emulators.on("exit", (code) => process.exit(code ?? 0));

const documentsUrl = `http://127.0.0.1:${port}/v1/projects/${projectId}/databases/(default)/documents/championRegions?pageSize=1`;

const countSeeded = async () => {
    const response = await fetch(documentsUrl, {
        headers: { Authorization: "Bearer owner" },
    });

    if (!response.ok) return null;

    return ((await response.json()).documents ?? []).length;
};

const waitForFirestore = async () => {
    for (let attempt = 0; attempt < 120; attempt += 1) {
        const seeded = await countSeeded().catch(() => null);
        if (seeded !== null) return seeded;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return null;
};

const seeded = await waitForFirestore();

if (seeded === 0) {
    console.log("\nchampionRegions is empty, seeding it now...");
    const seed = spawn(process.execPath, ["scripts/seed-emulator.mjs"], { stdio: "inherit" });
    seed.on("exit", (code) => {
        if (code !== 0) console.error("Could not seed championRegions. Retry with npm run seed:emulator.");
    });
} else if (seeded === null) {
    console.error("Firestore did not become ready. Check the emulator output above.");
}

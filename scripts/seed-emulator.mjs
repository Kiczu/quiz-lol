import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

const readWebConfig = async () => {
    const source = await readFile(new URL("src/api/firebase/firebaseConfig.ts", root), "utf8");
    const field = (name) => source.split(name + ":")[1]?.split('"')[1];
    const apiKey = field("apiKey");
    const projectId = field("projectId");

    if (!apiKey || !projectId) {
        throw new Error("Could not read apiKey and projectId from firebaseConfig.ts.");
    }

    return { apiKey, projectId };
};

const readFirestorePort = async () => {
    const config = JSON.parse(await readFile(new URL("firebase.json", root), "utf8"));
    return config.emulators?.firestore?.port ?? 8080;
};

const fetchLiveCollection = async (projectId, apiKey, collection) => {
    const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}?pageSize=300&key=${apiKey}`;
    const documents = [];
    let pageToken;

    do {
        const response = await fetch(pageToken ? `${base}&pageToken=${pageToken}` : base);

        if (!response.ok) {
            throw new Error(`Live Firestore replied ${response.status} for ${collection}.`);
        }

        const page = await response.json();
        documents.push(...(page.documents ?? []));
        pageToken = page.nextPageToken;
    } while (pageToken);

    return documents;
};

const writeToEmulator = async (port, projectId, collection, documents) => {
    for (const document of documents) {
        const id = encodeURIComponent(document.name.split("/").pop());
        const url = `http://127.0.0.1:${port}/v1/projects/${projectId}/databases/(default)/documents/${collection}/${id}`;

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                Authorization: "Bearer owner",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fields: document.fields }),
        });

        if (!response.ok) {
            throw new Error(`Emulator replied ${response.status}: ${await response.text()}`);
        }
    }
};

const run = async () => {
    const { apiKey, projectId } = await readWebConfig();
    const port = await readFirestorePort();

    const documents = await fetchLiveCollection(projectId, apiKey, "championRegions");
    console.log(`Pulled ${documents.length} champion regions from the live project.`);

    await writeToEmulator(port, projectId, "championRegions", documents);
    console.log(`Seeded championRegions into the emulator on port ${port}.`);
};

run().catch((error) => {
    if (error.cause?.code === "ECONNREFUSED") {
        console.error("No emulator on that port. Start it first with: npm run emulators");
    } else {
        console.error(error.message);
    }
    process.exitCode = 1;
});

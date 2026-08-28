import { api } from '../api/api';
import { ApiResponse, ChampionDetails } from '../api/types';

const BASE_URL = 'https://ddragon.leagueoflegends.com';

let versionRequest: Promise<string> | null = null;

function getVersion() {
    if (!versionRequest) {
        versionRequest = api
            .get<string[]>(`${BASE_URL}/api/versions.json`)
            .then((versions) => versions[0])
            .catch((error) => {
                versionRequest = null;
                throw error;
            });
    }
    return versionRequest;
}

function getAll() {
    return getVersion()
        .then((version) => api.get<ApiResponse>(`${BASE_URL}/cdn/${version}/data/en_US/champion.json`))
        .then((data) => Object.values(data.data));
}

function getChampion(championName: string) {
    return getVersion()
        .then((version) => api.get<ApiResponse>(`${BASE_URL}/cdn/${version}/data/en_US/champion/${championName}.json`))
        .then((data) => data.data[championName]);
}

const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function findByLabel(champions: ChampionDetails[], label: string) {
    const slug = toSlug(label);
    return (
        champions.find(
            (champion) => toSlug(champion.id) === slug || toSlug(champion.name) === slug
        ) ?? null
    );
}

function getImageUrl(championName: string, version: string) {
    return `${BASE_URL}/cdn/${version}/img/champion/${championName}.png`;
}

function getSpellImageUrl(spellImage: string, version: string) {
    return `${BASE_URL}/cdn/${version}/img/spell/${spellImage}`;
}

export const characterService = {
    getAll,
    getChampion,
    getVersion,
    findByLabel,
    getImageUrl,
    getSpellImageUrl,
};

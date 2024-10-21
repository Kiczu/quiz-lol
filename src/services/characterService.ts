import { api } from '../api/api';
import { ApiResponse } from '../api/types';

function getAll() {
    return api
        .get<ApiResponse>('https://ddragon.leagueoflegends.com/cdn/14.10.1/data/en_US/champion.json')
        .then((data) => Object.values(data.data));
}

function getChampion(championName: string) {
    return api
       .get<ApiResponse>(`https://ddragon.leagueoflegends.com/cdn/14.10.1/data/en_US/champion/${championName}.json`)
       .then((data) => data.data[championName]);
}

export const characterService = {
    getAll,
    getChampion,
};
import { api } from './api';
import { ApiResponse } from './types';

function getAll() {
  return api
    .get<ApiResponse>('https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/champion.json')
    .then((data) => Object.values(data.data));
}

export const characterService = {
  getAll,
};

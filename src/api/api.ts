const get = <T>(url: string): Promise<T> => {
  return fetch(url).then((response) => response.json());
};

export const api = {
  get,
};

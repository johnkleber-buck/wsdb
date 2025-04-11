import { fetchData } from './apiClient';
import { Software } from '../types';

const ENDPOINT = '/software';

export async function getSoftware() {
  return fetchData<Software[]>(ENDPOINT);
}

export async function getSoftwareByName(softwareName: string) {
  return fetchData<Software>(`${ENDPOINT}/${softwareName}`);
}
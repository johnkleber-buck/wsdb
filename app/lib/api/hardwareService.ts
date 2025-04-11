import { fetchData } from './apiClient';
import { HardwareSpecs } from '../types';

const ENDPOINT = '/hardware-specs';

export async function getHardwareSpecs() {
  return fetchData<HardwareSpecs[]>(ENDPOINT);
}

export async function getHardwareSpecById(specId: string) {
  return fetchData<HardwareSpecs>(`${ENDPOINT}/${specId}`);
}
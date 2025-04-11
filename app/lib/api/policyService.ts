import { fetchData, postData } from './apiClient';
import { Policy } from '../types';

const ENDPOINT = '/policies';

export async function getPolicies() {
  return fetchData<Policy[]>(ENDPOINT);
}

export async function getPolicyByName(policyName: string) {
  return fetchData<Policy>(`${ENDPOINT}/${policyName}`);
}

export async function createPolicy(policy: Omit<Policy, 'policyName'> & { policyName?: string }) {
  return postData<Policy>(ENDPOINT, policy);
}
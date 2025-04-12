import { fetchData, postData } from './apiClient';
import { Workstation, FilterParams } from '../types';

const ENDPOINT = '/workstations';

export async function getWorkstations(params?: FilterParams) {
  return fetchData<Workstation[]>(ENDPOINT, params);
}

export async function getWorkstationById(machineName: string) {
  return fetchData<Workstation>(`${ENDPOINT}/${machineName}`);
}

export async function updateWorkstationStatus(
  machineName: string,
  status: Workstation['status'],
  assignedTo?: string
) {
  return postData<Workstation>(`${ENDPOINT}/${machineName}/status`, {
    status,
    assignedTo,
    assignmentStartTime: assignedTo ? new Date().toISOString() : undefined,
  });
}

export async function assignWorkstation(machineName: string, username: string) {
  return postData<Workstation>(`${ENDPOINT}/${machineName}/assign`, {
    username,
    assignmentStartTime: new Date().toISOString(),
  });
}

export async function releaseWorkstation(machineName: string) {
  return postData<Workstation>(`${ENDPOINT}/${machineName}/release`, {});
}

export async function checkPolicyCompliance(machineName: string, username: string) {
  return postData<{ compliant: boolean; violations?: string[] }>(
    `${ENDPOINT}/${machineName}/check-policy-compliance`,
    { username, machineName }
  );
}
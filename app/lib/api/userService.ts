import { fetchData, postData } from './apiClient';
import { User, FilterParams } from '../types';

const ENDPOINT = '/users';

export async function getUsers(params?: FilterParams) {
  return fetchData<User[]>(ENDPOINT, params);
}

export async function getUserByUsername(username: string) {
  return fetchData<User>(`${ENDPOINT}/${username}`);
}

export async function updateUserProjectAssignment(username: string, projectAssignment: string) {
  return postData<User>(`${ENDPOINT}/${username}/project`, {
    projectAssignment,
  });
}

export async function getUserAssignments(username: string) {
  return fetchData<{ currentAssignment?: string; history: Array<{ machineName: string; startTime: string; endTime?: string }> }>(
    `${ENDPOINT}/${username}/assignments`
  );
}
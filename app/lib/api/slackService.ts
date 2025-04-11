import { postData } from './apiClient';

const ENDPOINT = '/slack';

export async function sendSlackNotification(
  channel: string,
  message: string,
  blocks?: Array<Record<string, any>>
) {
  return postData<{ ok: boolean }>(`${ENDPOINT}/send`, {
    channel,
    text: message,
    blocks,
  });
}

export async function processWorkstationRequest(payload: {
  userId: string;
  username: string;
  requirements: {
    location?: string;
    software?: string[];
    type?: string;
    duration?: string;
  };
}) {
  return postData<{
    success: boolean;
    message: string;
    workstation?: { machineName: string; location: string };
  }>(`${ENDPOINT}/workstation-request`, payload);
}
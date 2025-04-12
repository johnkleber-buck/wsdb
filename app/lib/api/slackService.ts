import { postData } from './apiClient';
import axios from 'axios';

const ENDPOINT = '/slack';

/**
 * Send a notification to a Slack channel
 */
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

/**
 * Send a direct message to a Slack response URL
 * This is used for responding to Slack slash commands or interactive components
 */
export async function sendSlackMessage(
  responseUrl: string,
  message: Record<string, any>
) {
  try {
    // Direct API call to Slack's response URL
    const response = await axios.post(responseUrl, message, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return { data: response.data };
  } catch (error) {
    console.error('Error sending Slack message:', error);
    return {
      data: {},
      error: error instanceof Error ? error.message : 'Unknown error sending Slack message',
    };
  }
}

/**
 * Process a workstation request from Slack
 */
export async function processWorkstationRequest(payload: {
  username: string;
  location: string;
  workstationType?: string;
  requirements?: Record<string, any>;
  channel_id?: string;
  response_url?: string;
}) {
  return postData<{
    success: boolean;
    message: string;
    workstation?: { 
      machineName: string; 
      location: string;
      type: string;
      os: string;
    };
  }>(`${ENDPOINT}/workstation-request`, payload);
}
import { NextRequest, NextResponse } from 'next/server';
import { mockApiHandlers } from '@/app/lib/mockApi';
import { getUsers } from '@/app/lib/api/userService';
import { getWorkstations, checkPolicyCompliance, assignWorkstation } from '@/app/lib/api/workstationService';
import { sendSlackMessage } from '@/app/lib/api/slackService';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Extract request details
    const { 
      username, 
      location, 
      workstationType = 'Desktop',  // Default to Desktop if not specified
      requirements = {},
      channel_id, 
      response_url 
    } = payload;

    // Validate required fields
    if (!username || !location) {
      const errorMessage = {
        text: "Missing required fields (username and location are required)",
        response_type: "ephemeral"
      };
      
      // Send error response back to Slack
      if (response_url) {
        await sendSlackMessage(response_url, errorMessage);
      }
      
      return NextResponse.json(errorMessage, { status: 400 });
    }

    // Get user details
    const userResponse = await getUsers({ search: username });
    if (!userResponse.data || userResponse.data.length === 0) {
      const errorMessage = {
        text: `User not found: ${username}`,
        response_type: "ephemeral"
      };
      
      if (response_url) {
        await sendSlackMessage(response_url, errorMessage);
      }
      
      return NextResponse.json(errorMessage, { status: 404 });
    }
    
    const user = userResponse.data[0];

    // Find available workstations that match requirements
    const filters = {
      status: 'Available',
      location: location,
      type: workstationType
    };
    
    const workstationsResponse = await getWorkstations(filters);
    if (!workstationsResponse.data || workstationsResponse.data.length === 0) {
      const errorMessage = {
        text: `No available workstations found matching your requirements (${location}, ${workstationType})`,
        response_type: "ephemeral"
      };
      
      if (response_url) {
        await sendSlackMessage(response_url, errorMessage);
      }
      
      return NextResponse.json(errorMessage, { status: 404 });
    }

    // Find a suitable workstation that complies with policy
    let assignedWorkstation = null;
    let policyViolations = [];

    for (const workstation of workstationsResponse.data) {
      // Check policy compliance
      const complianceResponse = await checkPolicyCompliance(workstation.machineName, user.username);
      
      if (complianceResponse.data.compliant) {
        assignedWorkstation = workstation;
        break;
      } else {
        policyViolations = complianceResponse.data.violations || [];
      }
    }

    // If no compliant workstation found
    if (!assignedWorkstation) {
      const errorMessage = {
        text: `No policy-compliant workstations available. Violations: ${policyViolations.join(', ')}`,
        response_type: "ephemeral"
      };
      
      if (response_url) {
        await sendSlackMessage(response_url, errorMessage);
      }
      
      return NextResponse.json(errorMessage, { status: 403 });
    }

    // Assign the workstation
    const assignResponse = await assignWorkstation(assignedWorkstation.machineName, user.username);
    
    if (assignResponse.error) {
      const errorMessage = {
        text: `Error assigning workstation: ${assignResponse.error}`,
        response_type: "ephemeral"
      };
      
      if (response_url) {
        await sendSlackMessage(response_url, errorMessage);
      }
      
      return NextResponse.json(errorMessage, { status: 500 });
    }

    // Create success message
    const successMessage = {
      response_type: "in_channel",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `✅ *Workstation Assigned Successfully*`
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*User:*\n${user.username}`
            },
            {
              type: "mrkdwn",
              text: `*Workstation:*\n${assignedWorkstation.machineName}`
            },
            {
              type: "mrkdwn",
              text: `*Location:*\n${assignedWorkstation.location}`
            },
            {
              type: "mrkdwn",
              text: `*Type:*\n${assignedWorkstation.type}`
            }
          ]
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Assignment made at ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    };

    // Send response back to Slack
    if (response_url) {
      await sendSlackMessage(response_url, successMessage);
    }

    // Send notification to the channel
    if (channel_id) {
      await mockApiHandlers.sendSlackNotification(
        channel_id,
        `Workstation ${assignedWorkstation.machineName} has been assigned to ${user.username}`,
        successMessage.blocks
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Workstation ${assignedWorkstation.machineName} has been assigned to ${user.username}`,
      workstation: {
        machineName: assignedWorkstation.machineName,
        location: assignedWorkstation.location,
        type: assignedWorkstation.type,
        os: assignedWorkstation.os
      }
    });
    
  } catch (error) {
    console.error('Error processing workstation request:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { 
      status: 500 
    });
  }
}
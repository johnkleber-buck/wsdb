import { NextRequest, NextResponse } from 'next/server';
import { mockApiHandlers } from '@/app/lib/mockApi';

export async function GET(
  request: NextRequest,
  { params }: { params: { machineName: string } }
) {
  const { machineName } = params;
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  
  if (!username) {
    return NextResponse.json(
      { error: 'Username query parameter is required' },
      { status: 400 }
    );
  }
  
  // Check policy compliance
  const response = await mockApiHandlers.checkPolicyCompliance(machineName, username);
  
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 400 });
  }
  
  return NextResponse.json(response.data);
}
import { NextRequest, NextResponse } from 'next/server';
import { mockApiHandlers } from '@/app/lib/mockApi';

export async function POST(
  request: NextRequest,
  { params }: { params: { machineName: string } }
) {
  const { machineName } = params;
  const { username } = await request.json();
  
  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }
  
  // Assign workstation to user
  const response = await mockApiHandlers.assignWorkstation(machineName, username);
  
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 400 });
  }
  
  return NextResponse.json(response.data);
}
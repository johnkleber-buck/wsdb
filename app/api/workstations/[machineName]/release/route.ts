import { NextRequest, NextResponse } from 'next/server';
import { mockApiHandlers } from '@/app/lib/mockApi';

export async function POST(
  request: NextRequest,
  { params }: { params: { machineName: string } }
) {
  const { machineName } = params;
  
  // Release workstation
  const response = await mockApiHandlers.releaseWorkstation(machineName);
  
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 400 });
  }
  
  return NextResponse.json(response.data);
}
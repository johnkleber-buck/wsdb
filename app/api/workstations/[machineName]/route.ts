import { NextRequest, NextResponse } from 'next/server';
import { mockApiHandlers } from '@/app/lib/mockApi';

export async function GET(
  request: NextRequest,
  { params }: { params: { machineName: string } }
) {
  const { machineName } = params;
  
  // Get workstation by machine name
  const response = await mockApiHandlers.getWorkstationById(machineName);
  
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 404 });
  }
  
  return NextResponse.json(response.data);
}
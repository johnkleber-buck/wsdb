import { NextRequest, NextResponse } from 'next/server';
import { mockApiHandlers } from '@/app/lib/mockApi';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  
  // Process workstation request
  const response = await mockApiHandlers.processWorkstationRequest(payload);
  
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 400 });
  }
  
  return NextResponse.json(response.data);
}
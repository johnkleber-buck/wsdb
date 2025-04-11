import { NextRequest, NextResponse } from 'next/server';
import { mockApiHandlers } from '@/app/lib/mockApi';

export async function GET(request: NextRequest) {
  // Get query parameters
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  
  // Get workstations with filters
  const response = await mockApiHandlers.getWorkstations(params);
  
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 400 });
  }
  
  return NextResponse.json(response.data);
}
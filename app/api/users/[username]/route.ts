import { NextRequest, NextResponse } from 'next/server';
import { mockApiHandlers } from '@/app/lib/mockApi';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;
  
  // Get user by username
  const response = await mockApiHandlers.getUserByUsername(username);
  
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 404 });
  }
  
  return NextResponse.json(response.data);
}
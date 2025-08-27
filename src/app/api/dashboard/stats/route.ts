import { NextRequest, NextResponse } from 'next/server';
import mockDataService from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  try {
    // Get dashboard statistics
    const stats = await mockDataService.getDashboardStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}
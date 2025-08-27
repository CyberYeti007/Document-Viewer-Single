import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Fetch document metadata from your database
    // This is a mock - replace with actual database query
    const metadata = {
      id,
      documentId: 'QMS-SOP-001',
      name: 'Standard Operating Procedure',
      status: 'approved',
      version: '2.1',
      owner: 'John Smith',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-10-15'),
      category: 'SOP',
      securityLevel: 'CONFIDENTIAL'
    };
    
    return NextResponse.json(metadata);
    
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document metadata' },
      { status: 500 }
    );
  }
}
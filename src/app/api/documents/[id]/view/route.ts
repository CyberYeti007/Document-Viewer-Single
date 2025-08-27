import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Connect to MongoDB and GridFS
    const client = await clientPromise;
    const db = client.db('filesDb');
    const bucket = new GridFSBucket(db, { bucketName: 'documents' });
    
    // Stream the document
    const objectId = new ObjectId(id);
    const downloadStream = bucket.openDownloadStream(objectId);
    const chunks: Buffer[] = [];
    
    for await (const chunk of downloadStream) {
      chunks.push(chunk as Buffer);
    }
    
    const buffer = Buffer.concat(chunks);
    
    // Return with appropriate headers for viewing
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `inline; filename="document.docx"`,
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Document view error:', error);
    return NextResponse.json(
      { error: 'Failed to load document' },
      { status: 500 }
    );
  }
}
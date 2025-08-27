import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { headerConfig, format = 'docx' } = body;
    
    // Connect to MongoDB and GridFS
    const client = await clientPromise;
    const db = client.db('filesDb');
    const bucket = new GridFSBucket(db, { bucketName: 'documents' });
    
    // Process document with headers (similar to process route)
    // ... (same processing logic as above)
    
    // For now, return the original document
    const objectId = new ObjectId(id);
    const downloadStream = bucket.openDownloadStream(objectId);
    const chunks: Buffer[] = [];
    
    for await (const chunk of downloadStream) {
      chunks.push(chunk as Buffer);
    }
    
    const buffer = Buffer.concat(chunks);
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': format === 'pdf' 
          ? 'application/pdf' 
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="document.${format}"`,
      }
    });
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}
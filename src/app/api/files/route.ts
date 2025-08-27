import { prisma } from "@/lib/db/postgres";
import { NextRequest, NextResponse } from "next/server";
import mockDataService from '@/lib/mock-data';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    if (!folderId) {
        return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    try {
        // Try database first, fallback to mock data
        let files;
        try {
            files = await prisma.file.findMany({
                where: {
                    folderId: folderId
                }
            });
        } catch (dbError) {
            console.log('Database not available, using mock data');
            files = await mockDataService.getFiles(folderId);
        }

        return NextResponse.json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }
}
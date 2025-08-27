import { prisma } from "@/lib/db/postgres";
import { NextRequest, NextResponse } from "next/server";
import mockDataService from '@/lib/mock-data';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
        return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });
    }

    try {
        // Try database first, fallback to mock data
        let folders;
        try {
            folders = await prisma.folder.findMany({
                where: {
                    parentId: parentId
                }
            });
        } catch (dbError) {
            console.log('Database not available, using mock data');
            folders = await mockDataService.getFolders(parentId);
        }

        return NextResponse.json(folders);
    } catch (error) {
        console.error('Error fetching folders:', error);
        return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
    }
}
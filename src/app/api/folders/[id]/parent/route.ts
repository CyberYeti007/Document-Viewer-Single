import { prisma } from "@/lib/db/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest, 
    { params }: { params: { id: string } }
) {
    const { id } = await params;

    try {
        // First, get the current folder to find its parentId
        const currentFolder = await prisma.folder.findUnique({
            where: {
                id: id
            }
        });
        // If currentFolder is not found, return a 404 error
        if (!currentFolder) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        // Then fetch the parent folder using the parentId
        const parent = await prisma.folder.findUnique({
            where: {
                id: currentFolder.parentId
            }
        });

        if (!parent) {
            return NextResponse.json({ error: 'Parent folder not found' }, { status: 404 });
        }

        return NextResponse.json(parent);
    } catch (error) {
        console.error('Error fetching parent folder:', error);
        return NextResponse.json({ error: 'Failed to fetch parent folder' }, { status: 500 });
    }
}
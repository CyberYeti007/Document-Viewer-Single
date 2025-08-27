import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/postgres'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Received Prisma payload:', body)
        // Create a new file entry in the database
        const newFile = await prisma.file.create({
            data: {
                filename: body.filename,
                originalName: body.originalName,
                description: body.description,
                mimeType: body.mimeType,
                size: body.size,
                checksum: body.checksum,
                mongoId: body.mongoId,
                creatorId: body.creatorId,
                ownerId: body.ownerId,
                teamId: body.teamId,
                folderId: body.folderId,
            },
        })
        console.log('Created Prisma file object:', newFile)
        return NextResponse.json(newFile, { status: 201 })
    } catch (error: unknown) {
        console.error('Error creating file:', error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        return NextResponse.json(
            { error: 'Error creating file entry', details: errorMessage },
            { status: 500 }
        )
    }
}
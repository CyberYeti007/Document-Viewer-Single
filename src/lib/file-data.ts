import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getFileManagerData(teamId: string, parentFolderId?: string) {
  let folders, files;

  if (parentFolderId) {
    // Get subfolders and files of a specific folder
    folders = await prisma.folder.findMany({
      where: {
        teamId: teamId,
        parentId: parentFolderId,
        NOT: { id: parentFolderId } // exclude self-reference
      },
      orderBy: { name: 'asc' }
    })

    files = await prisma.file.findMany({
      where: {
        teamId: teamId,
        folderId: parentFolderId,
        isLatest: true
      },
      orderBy: { filename: 'asc' }
    })
  } else {
    // Get all folders and files for the team (the component will filter them)
    folders = await prisma.folder.findMany({
      where: {
        teamId: teamId
      },
      orderBy: { name: 'asc' }
    })

    files = await prisma.file.findMany({
      where: {
        teamId: teamId,
        isLatest: true
      },
      orderBy: { filename: 'asc' }
    })
  }

  return { folders, files }
}

// Helper function to get folder hierarchy for breadcrumbs
export async function getFolderPath(folderId: string): Promise<Array<{id: string, name: string}>> {
  const path: Array<{id: string, name: string}> = []
  let currentId = folderId
  
  while (currentId) {
    const folder = await prisma.folder.findUnique({
      where: { id: currentId },
      select: { id: true, name: true, parentId: true }
    })
    
    if (!folder || folder.id === folder.parentId) break // Stop at root folder
    
    path.unshift({ id: folder.id, name: folder.name })
    currentId = folder.parentId
  }
  
  return path
}

// Helper function to create a new folder
export async function createFolder(name: string, parentId: string, teamId: string) {
  return await prisma.folder.create({
    data: {
      name,
      parentId,
      teamId
    }
  })
}

// Helper function to delete an item
export async function deleteItem(id: string, type: 'file' | 'folder') {
  if (type === 'folder') {
    return await prisma.folder.delete({
      where: { id }
    })
  } else {
    return await prisma.file.delete({
      where: { id }
    })
  }
}

// Helper function to rename an item
export async function renameItem(id: string, type: 'file' | 'folder', newName: string) {
  if (type === 'folder') {
    return await prisma.folder.update({
      where: { id },
      data: { name: newName }
    })
  } else {
    return await prisma.file.update({
      where: { id },
      data: { filename: newName }
    })
  }
}
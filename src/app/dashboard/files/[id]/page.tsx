"use client";

import FileExplorer from "@/components/functional/file-explorer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type FileType = {
    id: string;
    filename: string;
    size: number;
    mimeType: string;
    createdAt: Date;
    updatedAt: Date;
    mongoId: string; // MongoDB Object ID
};

type FolderObject = {
  id: string; // UUID
  name: string;
  parentId?: string; // UUID of parent folder
  fileCount?: number;
  createdAt?: Date;
}

type parentFolderType = {
    id: string;
    name: string;
    parentId: string;
    createdAt: Date;
}

export default function FileList() {
    const { id } = useParams();
    const [files, setFiles] = useState<FileType[]>([]);
    const [folders, setFolders] = useState<FolderObject[]>([]);
    const [parentFolder, setParentFolder] = useState<parentFolderType>();

    useEffect(() => {
        const fetchFiles = async () => {
            if (id) {
                try {
                    const response = await fetch(`/api/files?folderId=${id}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    
                    // Check if data is an array before mapping
                    if (Array.isArray(data)) {
                        setFiles(data.map((file: FileType) => ({
                            id: file.id,
                            filename: file.filename,
                            size: file.size,
                            mimeType: file.mimeType,
                            createdAt: new Date(file.createdAt),
                            updatedAt: new Date(file.updatedAt),
                            mongoId: file.mongoId
                        })));
                    } else {
                        console.error('Expected array but got:', typeof data, data);
                        setFiles([]);
                    }
                } catch (error) {
                    console.error('Error fetching files:', error);
                    setFiles([]);
                }
            }
        };
        fetchFiles();
    }, [id]);

    useEffect(() => {
        const fetchFolders = async () => {
            if (id) {
                try {
                    const response = await fetch(`/api/folders?parentId=${id}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    
                    // Check if data is an array before mapping
                    if (Array.isArray(data)) {
                        setFolders(data.map((folder: FolderObject) => ({
                            id: folder.id,
                            name: folder.name,
                            parentId: folder.parentId,
                            createdAt: folder.createdAt ? new Date(folder.createdAt) : undefined
                        })));
                    } else {
                        console.error('Expected array but got:', typeof data, data);
                        setFolders([]);
                    }
                } catch (error) {
                    console.error('Error fetching folders:', error);
                    setFolders([]);
                }
            }
        };
        fetchFolders();
    }, [id]);

    useEffect(() => {
        const fetchParentFolder = async () => {
            if (id) {
                try {
                    const response = await fetch(`/api/folders/${id}/parent`);
                    if (response.ok) {
                        const parent = await response.json();
                        if (parent && typeof parent === 'object') {
                            setParentFolder({
                                id: parent.id,
                                name: parent.name,
                                parentId: parent.parentId,
                                createdAt: new Date(parent.createdAt)
                            });
                        }
                    } else {
                        // If there's no parent folder (root level), that's okay
                        console.log('No parent folder found (likely root level)');
                    }
                } catch (error) {
                    console.error('Error fetching parent folder:', error);
                }
            }
        };
        
        fetchParentFolder();
    }, [id]);

    return parentFolder ? (
        <FileExplorer files={files} folders={folders} parentFolder={parentFolder} />
    ) : null;
}
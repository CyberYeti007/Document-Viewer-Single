"use client"
import { Button } from "../ui/button";
import { Download, File, FileImageIcon, FileInput, FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import axios from "axios";


// Define interfaces for the data objects with UUIDs
interface FileObject {
  id: string; // UUID
  filename: string;
  size?: number;
  mimeType: string;
  createdAt?: Date;
  modifiedAt?: Date;
  mongoId: string; // MongoDB Object ID
}

interface FolderObject {
  id: string; // UUID
  name: string;
  parentId?: string; // UUID of parent folder
  fileCount?: number;
  createdAt?: Date;
}

interface FileExplorerProps {
  files?: FileObject[];
  folders?: FolderObject[];
  parentFolder: {
    id: string; 
    name: string;
    parentId: string;
    createdAt: Date;
  };
}

function FileExplorer({ files = [], folders = [], parentFolder }: FileExplorerProps) {
  const router = useRouter();
  const handleDownload = async (mongoId: string) => {
  try {
    console.log("File clicked, Mongo ID:", mongoId);
    const resp = await axios.get(`/api/upload/${mongoId}`, { responseType: "blob" });
    const blob = resp.data as Blob;

    // try header 'FileName' first, then Content-Disposition, then fallback
    const fileObjectHeader = files.filter(f => f.mongoId === mongoId)[0];
    const filenameHeader = fileObjectHeader ? fileObjectHeader.filename  : null
    let filename = filenameHeader || "download";
    if (!filename) {
      const cd = resp.headers["content-disposition"];
      if (cd) {
        const m = cd.match(/filename\*=UTF-8''([^;]+)/) || cd.match(/filename="?([^";]+)"?/);
        if (m) filename = decodeURIComponent(m[1]);
      }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download error:", err);
  }};
  const handleFolderClick = (folderId: string) => {
    router.push(`/dashboard/files/${folderId}`);
  };

  return (
    <div className="m-6 p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/50">

      {/* ----------------------- Top of File Explorer */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            File Manager - {parentFolder.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Folder ID: {parentFolder.id}</p>
        </div>
        <Link href={"/dashboard/files/upload"}>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <div className="flex flex-row gap-6">                                                                                        
        {/* ---------------------- Folder Navigation Sidebar */}
        <div className="flex items-left flex-col gap-3 bg-gradient-to-b from-slate-50 to-white rounded-xl p-4 shadow-inner border border-slate-200/50 min-w-[220px]">
          {/* Parent/Current Folder */}
          <Button 
            variant="outline" 
            size={"sm"} 
            className="text-sm font-semibold bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-slate-200 hover:border-blue-300  hover:cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
            title={`ID: ${parentFolder.id}`}
            onClick={() => handleFolderClick(parentFolder.id)}
          >
            <span className="text-lg mr-2">📁</span> {parentFolder.name}
          </Button>
          
          {/* Subfolders */}
          {folders.map((folder) => (
            <Button 
              key={folder.id} // Using UUID as key
              variant="outline" 
              size={"sm"} 
              className="text-sm ml-3 justify-start bg-white/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-slate-200/70 hover:border-blue-300 transition-all duration-200 hover:cursor-pointer group"
              title={`ID: ${folder.id}${folder.fileCount !== undefined ? ` • ${folder.fileCount} files` : ''}`}
              onClick={() => handleFolderClick(folder.id)}
            >
              <span className="text-base mr-2 group-hover:scale-110 transition-transform">📁</span> 
              {folder.name}
            </Button>
          ))}
          
          {folders.length === 0 && (
            <p className="text-sm text-slate-400 italic ml-3 py-2">No subfolders</p>
          )}
        </div>

        {/* ----------------------- Files Grid */}
        <div className="grid grid-cols-5 gap-6 p-6 flex-1 bg-white/30 rounded-xl">
          {files.length > 0 ? (
            files.map((file) => (
              <div
                key={file.id} // Using UUID as key
                
                className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 p-4 rounded-2xl hover:shadow-2xl hover:scale-105 hover:border-blue-300 cursor-pointer group transition-all duration-300 shadow-md"
              >
               {file.mimeType.startsWith('text/') && (
                <FileText className="sm:size-4 md:size-8 lg:size-12 text-blue-500 mx-auto group-hover:text-indigo-600 transition-colors duration-200" />
               )}
               {file.mimeType.startsWith('image/') && (
                <FileImageIcon className="sm:size-4 md:size-8 lg:size-12 text-blue-500 mx-auto group-hover:text-indigo-600 transition-colors duration-200" />
               )}
               {file.mimeType.startsWith('application/') && (
                <FileInput className="sm:size-4 md:size-8 lg:size-12 text-blue-500 mx-auto group-hover:text-indigo-600 transition-colors duration-200" />
               )}
               {!file.mimeType  && (
                <File className="sm:size-4 md:size-8 lg:size-12 text-blue-500 mx-auto group-hover:text-indigo-600 transition-colors duration-200"/>
               )}

                <p
                  className="text-slate-700 mt-3 text-center truncate font-semibold group-hover:text-slate-900 text-md"
                  title={file.filename}
                >
                  {file.filename}
                </p>
                <Download onClick={() => handleDownload(file.mongoId)} />
                
                {/* File metadata on hover */}
                <div className="text-xs text-slate-500 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 space-y-1">
                  {file.mimeType && <p className="truncate bg-slate-100 rounded px-1 py-0.5">Type: {file.mimeType}</p>}
                  {file.size && <p className="bg-slate-100 rounded px-2 py-0.5">Size: {formatFileSize(file.size)}</p>}
                </div>
              
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic col-span-5 text-center py-12 text-lg">No files in this folder</p>
          )}
        </div>
      </div>
      
      {/* Debug info - Remove in production */}
      <div className="mt-6 pt-4 border-t border-slate-200/50 text-xs text-slate-400 bg-slate-50/50 rounded-lg p-3">
        <p className="font-mono">Debug: Parent UUID: {parentFolder.id}</p>
        <p className="font-mono">Files: {files.length} | Folders: {folders.length}</p>
      </div>
    </div>
  )
}

// Helper function to format file sizes
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default FileExplorer;
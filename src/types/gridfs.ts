import { ObjectId } from 'mongodb';

export interface FileMetadata {
  originalName: string;
  contentType: string;
  uploadDate: Date;
  userId?: string;
  description?: string;
}

export interface GridFSFile {
  _id: ObjectId;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  filename: string;
  metadata?: FileMetadata;
}

export interface UploadResponse {
  message: string;
  fileId: string;
  filename: string;
}

export interface FileListItem {
  id: string;
  filename: string;
  length: number;
  uploadDate: Date;
  contentType?: string;
}

export interface ErrorResponse {
  error: string;
}
"use client";
import { useRef, useState } from "react";
import { Upload, FileText, Building, Tag, Edit3, Hash } from "lucide-react";
import axios from "axios";

import hashString from "@/actions/encrypt";


const Uploader = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [formData, setFormData] = useState({
        docType: '',
        department: '',
        description: '',
        fileName: '',
        isoFileName: '',
        creatorId: 'cmdd9bybw0017p3rhx8qrsynf', // valid user id
        ownerId: 'cmdd9bybw0017p3rhx8qrsynf',   // valid user id
        teamId: 'cmcxjcayj0003p3pqqw5bpqkv',       // TODO: Replace with actual team id
        folderId: 'root',   // TODO: Replace with actual folder id
    });

    const docTypes = ['SOP', 'Comms', 'Policy', 'Manual', 'Report', 'Other'];
    const departments = ['SSE', 'QLE', 'CFI'];

    const generateISOFileName = () => {
        //  TODO: Implement ISO file name generation logic
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setSelectedFiles(files);
        
        // Auto-populate file name if only one file is selected
        if (files && files.length === 1) {
            const fileName = files[0].name.split('.')[0];
            setFormData(prev => ({ ...prev, fileName }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const input = fileRef.current!;

        if (!selectedFiles || selectedFiles.length === 0) {
            alert('Please select at least one file');
            return;
        }
        
        const uploadData = new FormData();

        // Add files
        for (const file of Array.from(input.files ?? [])) {
            uploadData.append(file.name, file);
        }
        // Add metadata
        Object.entries(formData).forEach(([key, value]) => {
            uploadData.append(key, value);
        });

        try {
            // 1. Upload to MongoDB
            console.log('Uploading files with metadata:', formData);
            const uploadRes = await axios.post("/api/upload", uploadData);
            console.log('MongoDB upload response:', uploadRes.data);
            const mongoFile = uploadRes.data; // Expecting { mongoId, filename, mimeType, size, checksum, ... }

            // 2. Create Prisma entry
            // TODO: Encrypt file name with bcrypt before passing to mongoId
            // For now, pass the plain file name (replace this with bcrypt logic below)
            // import bcryptjs if you want to use it client-side: import bcrypt from 'bcryptjs';
            const encryptedFileName = hashString(input.files?.[0].name || '');
            console.log('PRISMA - Encrypted file name:', input.files?.[0].name, encryptedFileName);
            const prismaPayload = {
                filename: mongoFile.filename || formData.fileName,
                originalName: selectedFiles[0]?.name || '',
                description: formData.description,
                mimeType: mongoFile.mimeType || selectedFiles[0]?.type || '',
                size: mongoFile.size || selectedFiles[0]?.size || 0,
                checksum: mongoFile.checksum || '',
                mongoId: encryptedFileName,
                creatorId: formData.creatorId,
                ownerId: formData.ownerId,
                teamId: formData.teamId,
                folderId: formData.folderId,
            };
            console.log('Sending Prisma payload:', prismaPayload);
            const prismaRes = await axios.post("/api/files/create", prismaPayload);
            console.log('Prisma API response:', prismaRes.data);

            alert('Files uploaded and database entry created successfully!');
            // Reset form after successful upload
            setSelectedFiles(null);
            setFormData({
                docType: '',
                department: '',
                description: '',
                fileName: '',
                isoFileName: '',
                creatorId: 'cmdd9bybw0017p3rhx8qrsynf',
                ownerId: 'cmdd9bybw0017p3rhx8qrsynf',
                teamId: 'cmcxjcayj0003p3pqqw5bpqkv',
                folderId: 'root',
            });
        } catch (error) {
            console.error('Upload failed:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('API error response:', error.response.data);
            }
            alert('Upload failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Document Upload System</h1>
                    <p className="text-slate-600">Upload and manage your documents with comprehensive metadata</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                File Upload
                            </h2>
                            
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
                                <input 
                                    type="file" 
                                    name="files" 
                                    ref={fileRef} 
                                    multiple 
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label 
                                    htmlFor="file-upload" 
                                    className="cursor-pointer inline-flex flex-col items-center"
                                >
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <Upload className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <span className="text-lg font-medium text-slate-800 mb-2">
                                        Click to select files
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        or drag and drop files here
                                    </span>
                                </label>
                            </div>

                            {selectedFiles && selectedFiles.length > 0 && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                                    <p className="text-sm font-medium text-slate-700 mb-2">Selected Files:</p>
                                    <div className="space-y-1">
                                        {Array.from(selectedFiles).map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                                                <FileText className="w-4 h-4" />
                                                <span>{file.name}</span>
                                                <span className="text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Document Metadata
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Document Type */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-1" />
                                        Document Type
                                    </label>
                                    <select
                                        name="docType"
                                        value={formData.docType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    >
                                        <option value="">Select document type</option>
                                        {docTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Department */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <Building className="w-4 h-4 inline mr-1" />
                                        Department
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    >
                                        <option value="">Select department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* File Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <Edit3 className="w-4 h-4 inline mr-1" />
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fileName"
                                        value={ formData.fileName}
                                        onChange={handleInputChange}
                                        placeholder="Enter display name for the document"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>

                                {/* ISO File Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <Hash className="w-4 h-4 inline mr-1" />
                                        ISO File Name
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="isoFileName"
                                            value={formData.isoFileName}
                                            onChange={handleInputChange}
                                            placeholder="Generated ISO file name"
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            onClick={generateISOFileName}
                                            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 whitespace-nowrap"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <Edit3 className="w-4 h-4 inline mr-1" />
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter a brief description of the document"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical"
                                />
                            </div>

                            {/* Creator ID */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Creator ID</label>
                                <input
                                    type="text"
                                    name="creatorId"
                                    value={formData.creatorId}
                                    onChange={handleInputChange}
                                    placeholder="Enter creator ID"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    required
                                />
                            </div>

                            {/* Owner ID */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Owner ID</label>
                                <input
                                    type="text"
                                    name="ownerId"
                                    value={formData.ownerId}
                                    onChange={handleInputChange}
                                    placeholder="Enter owner ID"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    required
                                />
                            </div>

                            {/* Team ID */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Team ID</label>
                                <input
                                    type="text"
                                    name="teamId"
                                    value={formData.teamId}
                                    onChange={handleInputChange}
                                    placeholder="Enter team ID"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    required
                                />
                            </div>

                            {/* Folder ID */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Folder ID</label>
                                <input
                                    type="text"
                                    name="folderId"
                                    value={formData.folderId}
                                    onChange={handleInputChange}
                                    placeholder="Enter folder ID"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            Upload Documents
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Uploader;
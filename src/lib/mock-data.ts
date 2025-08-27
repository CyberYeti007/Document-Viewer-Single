// Mock Data Service - Works without MongoDB
// This provides sample data for testing and demo purposes

export interface MockFile {
  id: string;
  filename: string;
  originalName: string;
  description: string;
  mimeType: string;
  size: number;
  mongoId: string;
  creatorId: string;
  ownerId: string;
  teamId: string;
  folderId: string;
  tags: string;
  securityLevel: number;
  version: number;
  isLatest: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'review' | 'approved' | 'archived';
  category: string;
  downloadUrl?: string;
}

export interface MockFolder {
  id: string;
  name: string;
  parentId: string | null;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  fileCount: number;
  teamId: string;
  color?: string;
  icon?: string;
}

export interface MockTeam {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: Date;
  isActive: boolean;
}

export interface DashboardStats {
  totalDocuments: number;
  pendingApprovals: number;
  activeProjects: number;
  teamMembers: number;
  recentActivity: number;
  complianceScore: number;
  documentsByCategory: { category: string; count: number }[];
  monthlyUploads: { month: string; count: number }[];
  documentsByStatus: { status: string; count: number }[];
}

class MockDataService {
  private files: MockFile[] = [];
  private folders: MockFolder[] = [];
  private teams: MockTeam[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create sample teams
    this.teams = [
      {
        id: 'team-1',
        name: 'Quality Assurance',
        description: 'QA team responsible for quality documentation',
        memberCount: 12,
        createdAt: new Date('2024-01-15'),
        isActive: true
      },
      {
        id: 'team-2',
        name: 'Compliance',
        description: 'Ensures regulatory compliance',
        memberCount: 8,
        createdAt: new Date('2024-02-01'),
        isActive: true
      },
      {
        id: 'team-3',
        name: 'Engineering',
        description: 'Technical documentation team',
        memberCount: 25,
        createdAt: new Date('2024-01-10'),
        isActive: true
      }
    ];

    // Create sample folders
    this.folders = [
      {
        id: 'folder-1',
        name: 'Standard Operating Procedures',
        parentId: null,
        description: 'Company SOPs and guidelines',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-10-15'),
        fileCount: 24,
        teamId: 'team-1',
        color: '#3B82F6',
        icon: '📋'
      },
      {
        id: 'folder-2',
        name: 'Quality Reports',
        parentId: null,
        description: 'Monthly and quarterly quality reports',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-10-20'),
        fileCount: 18,
        teamId: 'team-1',
        color: '#10B981',
        icon: '📊'
      },
      {
        id: 'folder-3',
        name: 'Compliance Documents',
        parentId: null,
        description: 'Regulatory and compliance documentation',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-10-25'),
        fileCount: 32,
        teamId: 'team-2',
        color: '#F59E0B',
        icon: '⚖️'
      },
      {
        id: 'folder-4',
        name: 'Training Materials',
        parentId: null,
        description: 'Employee training and onboarding',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-10-18'),
        fileCount: 15,
        teamId: 'team-1',
        color: '#8B5CF6',
        icon: '🎓'
      },
      {
        id: 'folder-5',
        name: 'Technical Specifications',
        parentId: null,
        description: 'Product and system specifications',
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-10-22'),
        fileCount: 28,
        teamId: 'team-3',
        color: '#EF4444',
        icon: '🔧'
      },
      {
        id: 'folder-6',
        name: '2024 Q4',
        parentId: 'folder-2',
        description: 'Fourth quarter 2024 reports',
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-26'),
        fileCount: 8,
        teamId: 'team-1',
        color: '#10B981',
        icon: '📅'
      }
    ];

    // Create sample files
    const fileTemplates = [
      { name: 'Quality Management System Manual', category: 'Manual', ext: 'pdf', status: 'approved' as const },
      { name: 'ISO 9001 Compliance Checklist', category: 'Checklist', ext: 'xlsx', status: 'approved' as const },
      { name: 'Employee Training Record', category: 'Form', ext: 'docx', status: 'review' as const },
      { name: 'Non-Conformance Report Template', category: 'Template', ext: 'docx', status: 'draft' as const },
      { name: 'Audit Report Q3 2024', category: 'Report', ext: 'pdf', status: 'approved' as const },
      { name: 'Risk Assessment Matrix', category: 'Assessment', ext: 'xlsx', status: 'review' as const },
      { name: 'Change Control Procedure', category: 'Procedure', ext: 'pdf', status: 'approved' as const },
      { name: 'Supplier Evaluation Form', category: 'Form', ext: 'docx', status: 'approved' as const },
      { name: 'Customer Satisfaction Survey Results', category: 'Report', ext: 'pdf', status: 'review' as const },
      { name: 'Process Flow Diagram - Manufacturing', category: 'Diagram', ext: 'pdf', status: 'approved' as const },
      { name: 'Emergency Response Plan', category: 'Plan', ext: 'pdf', status: 'approved' as const },
      { name: 'Document Control Procedure', category: 'Procedure', ext: 'pdf', status: 'approved' as const },
      { name: 'Equipment Calibration Schedule', category: 'Schedule', ext: 'xlsx', status: 'approved' as const },
      { name: 'Safety Data Sheet - Chemical X', category: 'Safety', ext: 'pdf', status: 'approved' as const },
      { name: 'Project Charter - System Upgrade', category: 'Project', ext: 'docx', status: 'draft' as const },
      { name: 'Meeting Minutes - Quality Review', category: 'Minutes', ext: 'docx', status: 'approved' as const },
      { name: 'Performance Metrics Dashboard', category: 'Dashboard', ext: 'xlsx', status: 'review' as const },
      { name: 'Corrective Action Request Form', category: 'Form', ext: 'docx', status: 'draft' as const },
      { name: 'Standard Work Instructions', category: 'Instructions', ext: 'pdf', status: 'approved' as const },
      { name: 'Validation Protocol - Process A', category: 'Protocol', ext: 'pdf', status: 'review' as const }
    ];

    this.files = fileTemplates.map((template, index) => ({
      id: `file-${index + 1}`,
      filename: `${template.name.toLowerCase().replace(/\s+/g, '-')}.${template.ext}`,
      originalName: `${template.name}.${template.ext}`,
      description: `${template.name} - ${template.category} document for quality management`,
      mimeType: this.getMimeType(template.ext),
      size: Math.floor(Math.random() * 5000000) + 100000, // Random size between 100KB and 5MB
      mongoId: `mock-mongo-${index + 1}`,
      creatorId: 'user-1',
      ownerId: 'user-1',
      teamId: this.teams[Math.floor(Math.random() * this.teams.length)].id,
      folderId: this.folders[Math.floor(Math.random() * (this.folders.length - 1))].id,
      tags: this.generateTags(template.category),
      securityLevel: Math.floor(Math.random() * 3) + 1,
      version: Math.floor(Math.random() * 3) + 1,
      isLatest: true,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000), // Random date in last 90 days
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date in last 30 days
      status: template.status,
      category: template.category,
      downloadUrl: `/api/mock/download/${index + 1}`
    }));
  }

  private getMimeType(ext: string): string {
    const mimeTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      doc: 'application/msword',
      xls: 'application/vnd.ms-excel',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      csv: 'text/csv'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  private generateTags(category: string): string {
    const baseTags = [category.toLowerCase()];
    const additionalTags = ['important', 'reviewed', 'compliance', 'quality', 'process', 'standard'];
    const selectedTags = additionalTags
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);
    return [...baseTags, ...selectedTags].join(',');
  }

  // API Methods
  async getFiles(folderId?: string): Promise<MockFile[]> {
    if (folderId && folderId !== 'root') {
      return this.files.filter(f => f.folderId === folderId);
    }
    return this.files;
  }

  async getFolders(parentId?: string): Promise<MockFolder[]> {
    if (parentId === 'root') {
      return this.folders.filter(f => !f.parentId);
    }
    if (parentId) {
      return this.folders.filter(f => f.parentId === parentId);
    }
    return this.folders;
  }

  async getFolder(id: string): Promise<MockFolder | null> {
    return this.folders.find(f => f.id === id) || null;
  }

  async getFile(id: string): Promise<MockFile | null> {
    return this.files.find(f => f.id === id) || null;
  }

  async searchFiles(query: string): Promise<MockFile[]> {
    const lowQuery = query.toLowerCase();
    return this.files.filter(f => 
      f.originalName.toLowerCase().includes(lowQuery) ||
      f.description.toLowerCase().includes(lowQuery) ||
      f.tags.includes(lowQuery) ||
      f.category.toLowerCase().includes(lowQuery)
    );
  }

  async getTeams(): Promise<MockTeam[]> {
    return this.teams;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Calculate monthly uploads for the last 6 months
    const monthlyUploads = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[monthDate.getMonth()];
      const count = this.files.filter(f => {
        const fileMonth = f.createdAt.getMonth();
        const fileYear = f.createdAt.getFullYear();
        return fileMonth === monthDate.getMonth() && fileYear === monthDate.getFullYear();
      }).length;
      monthlyUploads.push({ month: monthName, count: count || Math.floor(Math.random() * 20) + 5 });
    }

    // Group documents by category
    const categoryMap = new Map<string, number>();
    this.files.forEach(f => {
      categoryMap.set(f.category, (categoryMap.get(f.category) || 0) + 1);
    });
    const documentsByCategory = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Group documents by status
    const statusMap = new Map<string, number>();
    this.files.forEach(f => {
      statusMap.set(f.status, (statusMap.get(f.status) || 0) + 1);
    });
    const documentsByStatus = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }));

    return {
      totalDocuments: this.files.length,
      pendingApprovals: this.files.filter(f => f.status === 'review').length,
      activeProjects: 8,
      teamMembers: this.teams.reduce((sum, t) => sum + t.memberCount, 0),
      recentActivity: Math.floor(Math.random() * 50) + 20,
      complianceScore: 94,
      documentsByCategory,
      monthlyUploads,
      documentsByStatus
    };
  }

  async createFolder(name: string, parentId: string | null, description: string): Promise<MockFolder> {
    const newFolder: MockFolder = {
      id: `folder-${Date.now()}`,
      name,
      parentId,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      fileCount: 0,
      teamId: 'team-1',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      icon: '📁'
    };
    this.folders.push(newFolder);
    return newFolder;
  }

  async deleteFolder(id: string): Promise<boolean> {
    const index = this.folders.findIndex(f => f.id === id);
    if (index !== -1) {
      this.folders.splice(index, 1);
      // Also delete files in this folder
      this.files = this.files.filter(f => f.folderId !== id);
      return true;
    }
    return false;
  }

  async deleteFile(id: string): Promise<boolean> {
    const index = this.files.findIndex(f => f.id === id);
    if (index !== -1) {
      this.files.splice(index, 1);
      return true;
    }
    return false;
  }

  async updateFileStatus(id: string, status: MockFile['status']): Promise<MockFile | null> {
    const file = this.files.find(f => f.id === id);
    if (file) {
      file.status = status;
      file.updatedAt = new Date();
      return file;
    }
    return null;
  }
}

// Create singleton instance
const mockDataService = new MockDataService();

export default mockDataService;
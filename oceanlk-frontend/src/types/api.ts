export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_EDITOR' | 'HR_MANAGER' | 'RECRUITER' | 'USER';
export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
export type MediaCategory = 'NEWS' | 'BLOG' | 'MEDIA' | 'GALLERY' | 'PRESS_RELEASE' | 'EVENTS' | 'LIFE_AT_OCH';
export type MediaGroup = 'MEDIA_PANEL' | 'HR_PANEL';
export type MediaType = 'ARTICLE' | 'VIDEO' | 'GALLERY' | 'DOCUMENT';
export type JobStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'DRAFT';
export type ContactMessageStatus = 'NEW' | 'READ' | 'ARCHIVED';

// Models
export interface AdminUser {
    id: string;
    name: string;
    username: string;
    email: string;
    phone?: string;
    role: UserRole;
    active: boolean;
    verified: boolean;
    createdDate: string;
    lastLoginDate?: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    recipientRole: string;
    read: boolean;
    createdDate: string;
    link?: string;
    relatedEntity?: string;
}

export interface AuditLog {
    id: string;
    username: string;
    action: string;
    entityType: string;
    entityId?: string;
    details?: any;
    timestamp: string;
}

export interface JobOpportunity {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    description: string;
    featured: boolean;
    level: string;
    postedDate: string;
    status: JobStatus;
}

export interface MediaItem {
    id: string;
    title: string;
    description: string;
    excerpt?: string;
    imageUrl?: string;
    videoUrl?: string;
    category: MediaCategory;
    group: MediaGroup;
    type: MediaType;
    companyId?: string;
    company?: string;
    featured: boolean;
    author?: string;
    readTime?: string;
    duration?: string;
    photoCount?: number;
    pageCount?: number;
    galleryImages?: string[];
    publishedDate: string;
    status: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    submittedDate: string;
    status: ContactMessageStatus;
    isRead: boolean;
}

export interface TalentPoolApplication {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    experience: string;
    message: string;
    cvFilename?: string;
    cvFileId?: string;
    cvFileSize?: number;
    submittedDate: string;
    status: string;
}
export interface CorporateLeader {
    id: string;
    name: string;
    position: string;
    department: 'BOARD' | 'EXECUTIVE' | 'SENIOR';
    image: string;
    bio: string;
    shortDescription?: string;
    linkedin?: string;
    email?: string;
    displayOrder: number;
}

export interface LeadershipCategory {
    id: string;
    code: string;
    title: string;
    subtitle: string;
    displayOrder: number;
}

// Request/Response DTOs
export interface LoginResponse {
    token: string;
    name: string;
    username: string;
    role: UserRole;
    verified: boolean;
}

export interface UserCreateRequest {
    name: string;
    username: string;
    password?: string;
    email: string;
    phone?: string;
    role: UserRole;
}

export interface UserUpdateRequest {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    active: boolean;
}

export interface NotificationRequest {
    title: string;
    message: string;
    type: NotificationType;
    recipientRole: string;
    relatedEntity?: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
    // Admin & Auth
    LOGIN: `${BASE_URL}/api/admin/login`,
    VALIDATE_TOKEN: `${BASE_URL}/api/admin/validate`,
    RESET_PASSWORD: `${BASE_URL}/api/admin/reset-password`,

    // Admin Management
    ADMIN_LIST: `${BASE_URL}/api/admin/management/list`,
    ADMIN_ADD: `${BASE_URL}/api/admin/management/add`,
    ADMIN_EDIT: (id: string) => `${BASE_URL}/api/admin/management/edit/${id}`,
    ADMIN_DELETE: (id: string) => `${BASE_URL}/api/admin/management/delete/${id}`,
    ADMIN_PROFILE: (username: string) => `${BASE_URL}/api/admin/management/profile/${username}`,
    ADMIN_CHANGE_PASSWORD: `${BASE_URL}/api/admin/management/change-password`,

    // Notifications
    NOTIFICATIONS: `${BASE_URL}/api/admin/notifications`,
    CREATE_NOTIFICATION: `${BASE_URL}/api/admin/notifications/create`,
    MARK_READ: (id: string) => `${BASE_URL}/api/admin/notifications/${id}/mark-read`,
    MARK_ALL_READ: `${BASE_URL}/api/admin/notifications/mark-all-read`,

    // OTP
    OTP_SEND: `${BASE_URL}/api/admin/otp/send`,
    OTP_SEND_EMAIL: `${BASE_URL}/api/admin/otp/send-by-email`,
    OTP_VERIFY: `${BASE_URL}/api/admin/otp/verify`,

    // Jobs
    JOBS: `${BASE_URL}/api/jobs`,
    ADMIN_JOBS: `${BASE_URL}/api/admin/jobs`,
    ADMIN_JOB_BY_ID: (id: string) => `${BASE_URL}/api/admin/jobs/${id}`,

    // Media
    MEDIA: `${BASE_URL}/api/media`,
    MEDIA_GALLERY: `${BASE_URL}/api/media/gallery`,
    MEDIA_NEWS: `${BASE_URL}/api/media/news`,
    MEDIA_BLOGS: `${BASE_URL}/api/media/blogs`,
    MEDIA_MEDIA: `${BASE_URL}/api/media/media`,
    MEDIA_SINGLE: (id: string) => `${BASE_URL}/api/media/${id}`,
    ADMIN_MEDIA: `${BASE_URL}/api/admin/media`,
    ADMIN_MEDIA_BY_ID: (id: string) => `${BASE_URL}/api/admin/media/${id}`,
    ADMIN_MEDIA_UPLOAD: `${BASE_URL}/api/admin/media/upload`,

    // Talent Pool
    TALENT_POOL_SUBMIT: `${BASE_URL}/api/talent-pool/submit`,
    TALENT_POOL_APPLICATIONS: `${BASE_URL}/api/talent-pool/applications`,
    TALENT_POOL_CV: (id: string) => `${BASE_URL}/api/talent-pool/cv/${id}`,
    TALENT_POOL_STATUS: (id: string) => `${BASE_URL}/api/talent-pool/application/${id}/status`,
    TALENT_POOL_DELETE: (id: string) => `${BASE_URL}/api/talent-pool/application/${id}`,

    // Contact
    CONTACT_SUBMIT: `${BASE_URL}/api/contact`,
    CONTACT_MESSAGES: `${BASE_URL}/api/contact/messages`,
    CONTACT_MESSAGE_BY_ID: (id: string) => `${BASE_URL}/api/contact/messages/${id}`,
    CONTACT_MARK_READ: (id: string) => `${BASE_URL}/api/contact/messages/${id}/read`,
    CONTACT_MARK_UNREAD: (id: string) => `${BASE_URL}/api/contact/messages/${id}/unread`,
    CONTACT_DELETE: (id: string) => `${BASE_URL}/api/contact/messages/${id}`,
    CONTACT_STATS: `${BASE_URL}/api/contact/stats`,

    // Pending Changes
    PENDING_CHANGES: `${BASE_URL}/api/pending-changes`,
    PENDING_CHANGES_MY: `${BASE_URL}/api/pending-changes/my-submissions`,
    PENDING_CHANGE_APPROVE: (id: string) => `${BASE_URL}/api/pending-changes/${id}/approve`,
    PENDING_CHANGE_REJECT: (id: string) => `${BASE_URL}/api/pending-changes/${id}/reject`,

    // Audit Logs
    AUDIT_LOGS: `${BASE_URL}/api/admin/audit-logs`,
    AUDIT_LOG_DELETE: (id: string) => `${BASE_URL}/api/admin/audit-logs/${id}`,

    // Leadership
    LEADERSHIP: `${BASE_URL}/api/leadership`,
    LEADERSHIP_BY_ID: (id: string) => `${BASE_URL}/api/leadership/${id}`,
    LEADERSHIP_CATEGORIES: `${BASE_URL}/api/leadership-categories`,
    LEADERSHIP_CATEGORY_BY_CODE: (code: string) => `${BASE_URL}/api/leadership-categories/${code}`,
    ADMIN_LEADERSHIP: `${BASE_URL}/api/admin/leadership`,
    ADMIN_LEADERSHIP_CATEGORIES: `${BASE_URL}/api/admin/leadership/categories`,

    // Events
    EVENTS: `${BASE_URL}/api/events`,
    EVENT_BY_ID: (id: string) => `${BASE_URL}/api/events/${id}`,

    // Testimonials
    TESTIMONIALS: `${BASE_URL}/api/testimonials`,
    TESTIMONIAL_BY_ID: (id: string | number) => `${BASE_URL}/api/testimonials/${id}`,

    // WhatsApp
    WHATSAPP_PUBLIC: `${BASE_URL}/api/public/whatsapp`,
    WHATSAPP_ADMIN: `${BASE_URL}/api/admin/whatsapp`,

    // Metrics
    METRICS: `${BASE_URL}/api/metrics`,
    METRIC_BY_ID: (id: string | number) => `${BASE_URL}/api/metrics/${id}`,

    // Partners & Memberships
    PARTNERS: `${BASE_URL}/api/partners`,
    PARTNER_BY_ID: (id: string) => `${BASE_URL}/api/partners/${id}`,

    // Companies
    COMPANIES: `${BASE_URL}/api/companies`,
    COMPANY_BY_ID: (id: string) => `${BASE_URL}/api/companies/${id}`,
    ADMIN_COMPANIES: `${BASE_URL}/api/admin/companies`,
    ADMIN_COMPANY_BY_ID: (id: string) => `${BASE_URL}/api/admin/companies/${id}`,
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export default BASE_URL;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'superadmin' | 'admin' | 'hr' | 'editor';
export type EntityAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type PendingStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type JobStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED';
export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'CONTACTED' | 'REJECTED';
export type ContactStatus = 'NEW' | 'READ' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: UserRole
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          status?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          long_description: string | null
          logo_url: string | null
          website: string | null
          industry: string | null
          established: string | null
          image: string | null
          video: string | null
          employees: string | null
          revenue: string | null
          category: string | null
          stats: Json
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          long_description?: string | null
          logo_url?: string | null
          website?: string | null
          industry?: string | null
          established?: string | null
          image?: string | null
          video?: string | null
          employees?: string | null
          revenue?: string | null
          category?: string | null
          stats?: Json
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          long_description?: string | null
          logo_url?: string | null
          website?: string | null
          industry?: string | null
          established?: string | null
          image?: string | null
          video?: string | null
          employees?: string | null
          revenue?: string | null
          category?: string | null
          stats?: Json
          is_active?: boolean
          display_order?: number
          updated_at?: string
        }
      }
      job_opportunities: {
        Row: {
          id: string
          title: string
          company_id: string | null
          company_name: string | null
          location: string
          type: string
          category: string
          description: string
          requirements: string[]
          responsibilities: string[]
          level: string | null
          featured: boolean
          status: JobStatus
          deadline: string | null
          posted_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company_id?: string | null
          company_name?: string | null
          location: string
          type: string
          category: string
          description: string
          requirements?: string[]
          responsibilities?: string[]
          level?: string | null
          featured?: boolean
          status?: JobStatus
          deadline?: string | null
          posted_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company_id?: string | null
          company_name?: string | null
          location?: string
          type?: string
          category?: string
          description?: string
          requirements?: string[]
          responsibilities?: string[]
          level?: string | null
          featured?: boolean
          status?: JobStatus
          deadline?: string | null
          updated_at?: string
        }
      }
      talent_pool_applications: {
        Row: {
          id: string
          job_id: string | null
          full_name: string
          email: string
          phone: string
          position: string
          experience: string | null
          message: string | null
          cv_url: string
          cv_filename: string | null
          cv_file_size: number | null
          status: ApplicationStatus
          internal_notes: string | null
          submitted_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id?: string | null
          full_name: string
          email: string
          phone: string
          position: string
          experience?: string | null
          message?: string | null
          cv_url: string
          cv_filename?: string | null
          cv_file_size?: number | null
          status?: ApplicationStatus
          internal_notes?: string | null
          submitted_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string | null
          full_name?: string
          email?: string
          phone?: string
          position?: string
          experience?: string | null
          message?: string | null
          cv_url?: string
          cv_filename?: string | null
          cv_file_size?: number | null
          status?: ApplicationStatus
          internal_notes?: string | null
          updated_at?: string
        }
      }
      corporate_leaders: {
        Row: {
          id: string
          category_id: string | null
          name: string
          designation: string
          bio: string | null
          image_url: string | null
          linkedin_url: string | null
          email: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          designation: string
          bio?: string | null
          image_url?: string | null
          linkedin_url?: string | null
          email?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          designation?: string
          bio?: string | null
          image_url?: string | null
          linkedin_url?: string | null
          email?: string | null
          display_order?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          content: string | null
          date: string
          end_date: string | null
          location: string | null
          image_url: string | null
          gallery_images: string[]
          category: string | null
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          content?: string | null
          date: string
          end_date?: string | null
          location?: string | null
          image_url?: string | null
          gallery_images?: string[]
          category?: string | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          content?: string | null
          date?: string
          end_date?: string | null
          location?: string | null
          image_url?: string | null
          gallery_images?: string[]
          category?: string | null
          is_featured?: boolean
          is_active?: boolean
          updated_at?: string
        }
      }
      news_articles: {
        Row: {
          id: string
          slug: string
          title: string
          summary: string | null
          content: string
          author: string | null
          cover_image: string | null
          tags: string[]
          published_at: string
          is_published: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          summary?: string | null
          content: string
          author?: string | null
          cover_image?: string | null
          tags?: string[]
          published_at?: string
          is_published?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          summary?: string | null
          content?: string
          author?: string | null
          cover_image?: string | null
          tags?: string[]
          published_at?: string
          is_published?: boolean
          view_count?: number
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          status: ContactStatus
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          status?: ContactStatus
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          status?: ContactStatus
          ip_address?: string | null
          user_agent?: string | null
          updated_at?: string
        }
      }
      pending_changes: {
        Row: {
          id: string
          entity_type: string
          entity_id: string | null
          action: EntityAction
          status: PendingStatus
          submitted_by: string | null
          submitted_by_name: string | null
          submitted_at: string
          reviewed_by: string | null
          reviewed_by_name: string | null
          reviewed_at: string | null
          review_comments: string | null
          change_data: Json
          original_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          entity_id?: string | null
          action: EntityAction
          status?: PendingStatus
          submitted_by?: string | null
          submitted_by_name?: string | null
          submitted_at?: string
          reviewed_by?: string | null
          reviewed_by_name?: string | null
          reviewed_at?: string | null
          review_comments?: string | null
          change_data: Json
          original_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          entity_id?: string | null
          action?: EntityAction
          status?: PendingStatus
          submitted_by?: string | null
          submitted_by_name?: string | null
          reviewed_by?: string | null
          reviewed_by_name?: string | null
          reviewed_at?: string | null
          review_comments?: string | null
          change_data?: Json
          original_data?: Json | null
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          user_email: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          details: Json
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_email?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          user_email?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json
          ip_address?: string | null
        }
      }
    }
  }
}

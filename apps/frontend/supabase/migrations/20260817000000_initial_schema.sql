-- ==============================================================================
-- OCEANLK HOLDINGS - SUPABASE INITIAL SCHEMA & SECURITY SPECIFICATION
-- Target: PostgreSQL 15+ (Supabase)
-- ==============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS & DOMAINS
-- ==============================================================================

CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'hr', 'editor');
CREATE TYPE entity_action AS ENUM ('CREATE', 'UPDATE', 'DELETE');
CREATE TYPE pending_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE job_status AS ENUM ('ACTIVE', 'INACTIVE', 'CLOSED');
CREATE TYPE application_status AS ENUM ('PENDING', 'REVIEWED', 'CONTACTED', 'REJECTED');
CREATE TYPE contact_status AS ENUM ('NEW', 'READ', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED');

-- ==============================================================================
-- 2. USER PROFILES & RBAC HELPER FUNCTIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'editor',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Function to check if user has admin privileges
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'superadmin')
        AND status = 'ACTIVE'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'superadmin'
        AND status = 'ACTIVE'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_hr()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('hr', 'admin', 'superadmin')
        AND status = 'ACTIVE'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Trigger to create profile automatically on auth.users creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'editor'::user_role)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for auto updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. CORE CONTENT TABLES
-- ==============================================================================

-- Companies (Subsidiaries & Portfolios)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    long_description TEXT,
    logo_url TEXT,
    website TEXT,
    industry TEXT,
    established TEXT,
    image TEXT,
    video TEXT,
    employees TEXT,
    revenue TEXT,
    category TEXT,
    stats JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Job Opportunities
CREATE TABLE IF NOT EXISTS public.job_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    company_name TEXT,
    location TEXT NOT NULL,
    type TEXT NOT NULL, -- Full-time, Part-time, Contract, Remote
    category TEXT NOT NULL, -- Engineering, Hospitality, Logistics, etc.
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    responsibilities TEXT[] DEFAULT '{}',
    level TEXT, -- Junior, Mid-Senior, Executive
    featured BOOLEAN NOT NULL DEFAULT false,
    status job_status NOT NULL DEFAULT 'ACTIVE',
    deadline TIMESTAMPTZ,
    posted_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_jobs_updated_at BEFORE UPDATE ON public.job_opportunities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Talent Pool / Job Applications
CREATE TABLE IF NOT EXISTS public.talent_pool_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_opportunities(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    position TEXT NOT NULL,
    experience TEXT,
    message TEXT,
    cv_url TEXT NOT NULL,
    cv_filename TEXT,
    cv_file_size BIGINT,
    status application_status NOT NULL DEFAULT 'PENDING',
    internal_notes TEXT,
    submitted_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_applications_updated_at BEFORE UPDATE ON public.talent_pool_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Leadership Categories & Members
CREATE TABLE IF NOT EXISTS public.leadership_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.corporate_leaders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.leadership_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    linkedin_url TEXT,
    email TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_leaders_updated_at BEFORE UPDATE ON public.corporate_leaders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Events
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location TEXT,
    image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    category TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- News & Press Releases
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    author TEXT,
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true,
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_news_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Testimonials & Partners
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name TEXT NOT NULL,
    author_role TEXT,
    company_name TEXT,
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website TEXT,
    category TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status contact_status NOT NULL DEFAULT 'NEW',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_contacts_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Global Metrics & Page Contents
CREATE TABLE IF NOT EXISTS public.global_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    suffix TEXT,
    description TEXT,
    icon TEXT,
    display_order INT DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT NOT NULL,
    section_key TEXT NOT NULL,
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_page_section UNIQUE (page_key, section_key)
);

-- ==============================================================================
-- 4. MAKER-CHECKER WORKFLOW & AUDIT LOGGING
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.pending_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- 'Company', 'Event', 'Leader', 'News', etc.
    entity_id TEXT, -- Target entity ID (or null if CREATE)
    action entity_action NOT NULL,
    status pending_status NOT NULL DEFAULT 'PENDING',
    submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    submitted_by_name TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_by_name TEXT,
    reviewed_at TIMESTAMPTZ,
    review_comments TEXT,
    change_data JSONB NOT NULL,
    original_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_pending_updated_at BEFORE UPDATE ON public.pending_changes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL, -- 'LOGIN', 'CREATE_COMPANY', 'APPROVE_CHANGE', etc.
    entity_type TEXT,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_pool_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 5.1 Profiles Policies
CREATE POLICY "Users can view own profile or admins can view all" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Superadmins can manage all profiles" ON public.profiles
    FOR ALL USING (public.is_superadmin());

-- 5.2 Public Read Entities (Active records visible to everyone, Full access to Admins)
CREATE POLICY "Public read active companies" ON public.companies
    FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin full company access" ON public.companies
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public read active jobs" ON public.job_opportunities
    FOR SELECT USING (status = 'ACTIVE' OR public.is_hr());
CREATE POLICY "HR/Admin manage jobs" ON public.job_opportunities
    FOR ALL USING (public.is_hr());

CREATE POLICY "Public read leaders" ON public.corporate_leaders
    FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage leaders" ON public.corporate_leaders
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public read leadership categories" ON public.leadership_categories
    FOR SELECT USING (true);
CREATE POLICY "Admin manage leadership categories" ON public.leadership_categories
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public read active events" ON public.events
    FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage events" ON public.events
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public read published news" ON public.news_articles
    FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admin manage news" ON public.news_articles
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public read testimonials" ON public.testimonials
    FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage testimonials" ON public.testimonials
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public read partners" ON public.partners
    FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin manage partners" ON public.partners
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public read global metrics" ON public.global_metrics
    FOR SELECT USING (true);
CREATE POLICY "Admin manage global metrics" ON public.global_metrics
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public read page contents" ON public.page_contents
    FOR SELECT USING (true);
CREATE POLICY "Admin manage page contents" ON public.page_contents
    FOR ALL USING (public.is_admin());

-- 5.3 Submissions (Contact & Job Applications)
CREATE POLICY "Public insert contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read and manage contact messages" ON public.contact_messages
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public insert job applications" ON public.talent_pool_applications
    FOR INSERT WITH CHECK (true);
CREATE POLICY "HR/Admin read and manage job applications" ON public.talent_pool_applications
    FOR ALL USING (public.is_hr());

-- 5.4 Maker-Checker & Audit Logs
CREATE POLICY "Admins can view and create pending changes" ON public.pending_changes
    FOR ALL USING (public.is_admin());

CREATE POLICY "Superadmins manage audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (public.is_admin());

-- ==============================================================================
-- 6. STORAGE BUCKETS CONFIGURATION & POLICIES
-- ==============================================================================

-- Create Storage Buckets (if storage schema exists)
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('public-media', 'public-media', true),
    ('resumes', 'resumes', false),
    ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Public Media Storage Policies
CREATE POLICY "Public media access" ON storage.objects
    FOR SELECT USING (bucket_id = 'public-media');

CREATE POLICY "Admin upload public media" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'public-media' AND public.is_admin());

CREATE POLICY "Admin update/delete public media" ON storage.objects
    FOR ALL USING (bucket_id = 'public-media' AND public.is_admin());

-- Resumes Private Storage Policies
CREATE POLICY "Public upload resumes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "HR and Admin view resumes" ON storage.objects
    FOR SELECT USING (bucket_id = 'resumes' AND public.is_hr());

-- Documents Private Storage Policies
CREATE POLICY "Admin view documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents' AND public.is_admin());

CREATE POLICY "Admin manage documents" ON storage.objects
    FOR ALL USING (bucket_id = 'documents' AND public.is_admin());

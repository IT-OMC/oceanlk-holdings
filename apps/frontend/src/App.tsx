import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './views/Home';
import Profile from './views/corporate/Profile';
import Leadership from './views/corporate/Leadership';
import Companies from './views/companies/Companies';
import CompanySingle from './views/companies/CompanySingle';
import Culture from './views/careers/Culture';
import EventSingle from './views/careers/EventSingle';
import Onboard from './views/careers/Onboard';
import JobApplication from './views/careers/JobApplication';
import TalentPool from './views/careers/TalentPool';
import Blogs from './views/news/Blogs';
import BlogSingle from './views/news/BlogSingle';
import News from './views/news/News';
import NewsSingle from './views/news/NewsSingle';
import Media from './views/news/Media';
import MediaSingle from './views/news/MediaSingle';
import Contact from './views/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Admin Pages
import AdminLogin from './views/admin/AdminLogin';
import AdminDashboard from './views/admin/AdminDashboard';
import MediaManagement from './views/admin/MediaManagement';
import NewsManagement from './views/admin/NewsManagement';
import BlogManagement from './views/admin/BlogManagement';
import GalleryManagement from './views/admin/GalleryManagement';
import DocumentsManagement from './views/admin/DocumentsManagement';
import ApplicationViewer from './views/admin/ApplicationViewer';
import JobManagement from './views/admin/JobManagement';
import ManageContactMessages from './views/admin/ManageContactMessages';
import HRMediaManagement from './views/admin/HRMediaManagement';
import EventsManagement from './views/admin/EventsManagement';
import TestimonialsManagement from './views/admin/TestimonialsManagement';
// New Admin Content Pages
import PageContentManager from './views/admin/PageContentManager';
import LeadershipManagement from './views/admin/LeadershipManagement';
import StatsManagement from './views/admin/StatsManagement';
import PartnerManagement from './views/admin/PartnerManagement';
import CompanyManagement from './views/admin/CompanyManagement';
import AuditLogViewer from './views/admin/AuditLogViewer';
import AdminProfile from './views/admin/Profile';
import AdminManagement from './views/admin/AdminManagement';
import PendingChanges from './views/admin/PendingChanges';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <ErrorBoundary>
            <Toaster position="top-right" toastOptions={{
                duration: 4000,
                style: {
                    background: '#0f1e3a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                }
            }} />
            <Router>
                <ScrollToTop />
                <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="profile" element={<AdminProfile />} />
                        <Route path="management" element={<AdminManagement />} />

                        <Route path="companies" element={<CompanyManagement />} />

                        {/* Page Management Routes */}
                        <Route path="pages/leadership" element={<LeadershipManagement />} />
                        <Route path="pages/partners" element={<PartnerManagement />} />
                        <Route path="pages/stats" element={<StatsManagement />} />

                        <Route path="media" element={<MediaManagement />} />

                        {/* News & Media Routes */}
                        <Route path="news-media/news" element={<NewsManagement />} />
                        <Route path="news-media/blog" element={<BlogManagement />} />
                        <Route path="news-media/gallery" element={<GalleryManagement />} />
                        <Route path="news-media/documents" element={<DocumentsManagement />} />

                        <Route path="contact-messages" element={<ManageContactMessages />} />

                        {/* Website Content Routes */}
                        <Route path="content/pages" element={<PageContentManager />} />
                        <Route path="content/leadership" element={<LeadershipManagement />} />
                        <Route path="content/stats" element={<StatsManagement />} />
                        <Route path="content/partners" element={<PartnerManagement />} />

                        <Route path="audit-logs" element={<AuditLogViewer />} />
                        <Route path="pending-changes" element={<PendingChanges />} />

                        {/* HR Routes */}
                        <Route path="hr/media" element={<HRMediaManagement />} />
                        <Route path="hr/events" element={<EventsManagement />} />
                        <Route path="hr/testimonials" element={<TestimonialsManagement />} />
                        <Route path="hr/applications" element={<ApplicationViewer />} />
                        <Route path="hr/jobs" element={<JobManagement />} />
                    </Route>

                    {/* Main Website Routes */}
                    <Route
                        path="/*"
                        element={
                            <>
                                <div className="fixed top-0 left-0 right-0 z-50">
                                    <Navbar />
                                </div>
                                <MainLayout>
                                    <Routes>
                                        <Route path="/" element={<Home />} />

                                        {/* Corporate Routes */}
                                        <Route path="/corporate/profile" element={<Profile />} />
                                        <Route path="/corporate/leadership" element={<Leadership />} />

                                        {/* Companies Routes */}
                                        <Route path="/companies" element={<Companies />} />
                                        <Route path="/companies/:id" element={<CompanySingle />} />

                                        {/* Careers Routes */}
                                        <Route path="/careers/culture" element={<Culture />} />
                                        <Route path="/careers/events/:id" element={<EventSingle />} />
                                        <Route path="/careers/opportunities" element={<Onboard />} />
                                        <Route path="/careers/opportunities/:id" element={<JobApplication />} />
                                        <Route path="/careers/talent-pool" element={<TalentPool />} />

                                        {/* News Routes */}
                                        <Route path="/news/blogs" element={<Blogs />} />
                                        <Route path="/news/blogs/:id" element={<BlogSingle />} />
                                        <Route path="/news/articles" element={<News />} />
                                        <Route path="/news/articles/:id" element={<NewsSingle />} />
                                        <Route path="/news/media" element={<Media />} />
                                        <Route path="/news/media/:id" element={<MediaSingle />} />

                                        {/* Contact Route */}
                                        <Route path="/contact" element={<Contact />} />
                                    </Routes>
                                </MainLayout>
                                <Footer />
                            </>
                        }
                    />
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;

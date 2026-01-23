import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Profile from './pages/corporate/Profile';
import Leadership from './pages/corporate/Leadership';
import Companies from './pages/companies/Companies';
import CompanySingle from './pages/companies/CompanySingle';
import Culture from './pages/careers/Culture';
import Onboard from './pages/careers/Onboard';
import JobApplication from './pages/careers/JobApplication';
import TalentPool from './pages/careers/TalentPool';
import Blogs from './pages/news/Blogs';
import BlogSingle from './pages/news/BlogSingle';
import News from './pages/news/News';
import NewsSingle from './pages/news/NewsSingle';
import Media from './pages/news/Media';
import MediaSingle from './pages/news/MediaSingle';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import MediaManagement from './pages/admin/MediaManagement';
import NewsManagement from './pages/admin/NewsManagement';
import BlogManagement from './pages/admin/BlogManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import ApplicationViewer from './pages/admin/ApplicationViewer';
import JobManagement from './pages/admin/JobManagement';
import ManageContactMessages from './pages/admin/ManageContactMessages';
import HRMediaManagement from './pages/admin/HRMediaManagement';
import EventsManagement from './pages/admin/EventsManagement';
import TestimonialsManagement from './pages/admin/TestimonialsManagement';
// New Admin Content Pages
import PageContentManager from './pages/admin/PageContentManager';
import LeadershipManagement from './pages/admin/LeadershipManagement';
import StatsManagement from './pages/admin/StatsManagement';
import PartnerManagement from './pages/admin/PartnerManagement';
import CompanyManagement from './pages/admin/CompanyManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
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
                    <Route path="companies" element={<CompanyManagement />} />
                    <Route path="media" element={<MediaManagement />} />

                    {/* News & Media Routes */}
                    <Route path="news-media/news" element={<NewsManagement />} />
                    <Route path="news-media/blog" element={<BlogManagement />} />
                    <Route path="news-media/gallery" element={<GalleryManagement />} />

                    <Route path="contact-messages" element={<ManageContactMessages />} />

                    {/* Website Content Routes */}
                    <Route path="content/pages" element={<PageContentManager />} />
                    <Route path="content/leadership" element={<LeadershipManagement />} />
                    <Route path="content/stats" element={<StatsManagement />} />
                    <Route path="content/partners" element={<PartnerManagement />} />

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
    );
}

export default App;

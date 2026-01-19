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
import ApplicationViewer from './pages/admin/ApplicationViewer';
import JobManagement from './pages/admin/JobManagement';
import ManageContactMessages from './pages/admin/ManageContactMessages';
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
                    <Route path="media" element={<MediaManagement />} />
                    <Route path="applications" element={<ApplicationViewer />} />
                    <Route path="jobs" element={<JobManagement />} />
                    <Route path="contact-messages" element={<ManageContactMessages />} />
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

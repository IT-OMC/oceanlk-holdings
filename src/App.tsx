import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
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
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <div className="fixed top-0 left-0 right-0 z-50">
                <TopBar />
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
        </Router>
    );
}

export default App;

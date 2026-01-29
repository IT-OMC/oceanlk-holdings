import Hero from '../components/Hero';
import HoldingDescription from '../components/HoldingDescription';
import GlobalConnections from '../components/GlobalConnections';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Sectors from '../components/Sectors';
import ErrorBoundary from '../components/ErrorBoundary';

const Home = () => {
    return (
        <div className="relative">
            <Hero />
            <HoldingDescription />
            <ErrorBoundary>
                <GlobalConnections />
            </ErrorBoundary>
            <Gallery />
            <Testimonials />
            <Sectors />
        </div>
    );
};

export default Home;

import Hero from '../components/Hero';
import ChatWidget from '../components/ChatWidget';
import Partners from '../components/Partners';
import GlobalMetrics from '../components/GlobalMetrics';
// import GlobalConnections from '../components/GlobalConnections';
import Gallery from '../components/Gallery';
import LatestUpdates from '../components/LatestUpdates';

import ErrorBoundary from '../components/ErrorBoundary';
import BusinessVideo from '../components/BusinessVideo';
import EcosystemAccordion from '../components/EcosystemAccordion';

const Home = () => {
    return (
        <div className="relative">
            <Hero />
            <Partners />
            <GlobalMetrics />
            {/* <GlobalConnections /> */}
            <ErrorBoundary>
                <BusinessVideo />
                <EcosystemAccordion />
            </ErrorBoundary>
            <Gallery />
            <LatestUpdates />
            <ChatWidget />
        </div>
    );
};

export default Home;

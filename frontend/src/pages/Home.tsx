import Hero from '../components/Hero';
import HoldingDescription from '../components/HoldingDescription';
import GlobalMetrics from '../components/GlobalMetrics';
import GlobalConnections from '../components/GlobalConnections';
import Gallery from '../components/Gallery';
import LatestUpdates from '../components/LatestUpdates';

import ErrorBoundary from '../components/ErrorBoundary';

const Home = () => {
    return (
        <div className="relative">
            <Hero />
            <HoldingDescription />
            <GlobalMetrics />
            <ErrorBoundary>
                <GlobalConnections />
            </ErrorBoundary>
            <Gallery />
            <LatestUpdates />

        </div>
    );
};

export default Home;

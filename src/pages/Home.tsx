import Hero from '../components/Hero';
import Portfolio from '../components/Portfolio';
import GlobalConnections from '../components/GlobalConnections';
import Stats from '../components/Stats';
import Sustainability from '../components/Sustainability';
import Sectors from '../components/Sectors';
import ErrorBoundary from '../components/ErrorBoundary';

const Home = () => {
    return (
        <div className="relative">
            <Hero />
            <Portfolio />
            <ErrorBoundary>
                <GlobalConnections />
            </ErrorBoundary>
            <Stats />
            <Sustainability />
            <Sectors />
        </div>
    );
};

export default Home;

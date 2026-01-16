import NewCultureHero from '../../components/culture/NewCultureHero';
import LifeAtHolding from '../../components/culture/LifeAtHolding';
import UpcomingEvents from '../../components/culture/UpcomingEvents';
import CultureCTA from '../../components/culture/CultureCTA';
import CultureGallery from '../../components/culture/CultureGallery';
import Navbar from '../../components/Navbar';

const Culture = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar />

            <NewCultureHero />

            <div className="space-y-12">
                <LifeAtHolding />

                <CultureGallery />

                <UpcomingEvents />

                <CultureCTA />
            </div>
        </div>
    );
};

export default Culture;

import { Link } from 'react-router-dom';
import CultureHero from '../../components/culture/CultureHero';
import VibeMeter from '../../components/culture/VibeMeter';
import ActivityTimeline from '../../components/culture/ActivityTimeline';
import EmployeeVoices from '../../components/culture/EmployeeVoices';

const Culture = () => {
    return (
        <div className="bg-ocean-dark min-h-screen text-white">
            {/* Section A: Hero */}
            <CultureHero />

            {/* Section B: Vibe Meter */}
            <VibeMeter />

            {/* Section C: Activity Showcase */}
            <ActivityTimeline />

            {/* Section D: Employee Voices */}
            <EmployeeVoices />

            {/* Section E: Footer / Transition */}
            <section className="py-32 bg-gradient-to-t from-black to-ocean-dark text-center px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-bold mb-12 tracking-tight">
                        Ready to jump in?
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                        <Link
                            to="/careers/opportunities"
                            className="group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-full overflow-hidden transition-transform hover:scale-105"
                        >
                            <span className="relative z-10 transition-colors group-hover:text-white">Join the Crew</span>
                            <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </Link>

                        <Link
                            to="/careers/talent-pool"
                            className="group relative px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full overflow-hidden transition-transform hover:scale-105"
                        >
                            <span className="relative z-10 text-white group-hover:text-black transition-colors">Join the Future</span>
                            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Culture;

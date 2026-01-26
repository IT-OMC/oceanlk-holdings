import { SectionWrapperProps } from '../types';

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className = '', id }) => {
    return (
        <section id={id} className={`w-full px-6 lg:px-12 ${className}`}>
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;

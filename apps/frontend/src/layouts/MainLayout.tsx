import { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-ocean-base">
            {children}
        </div>
    );
};

export default MainLayout;

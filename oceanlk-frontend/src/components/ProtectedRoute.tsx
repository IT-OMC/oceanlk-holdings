import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../utils/api';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                navigate('/admin');
                return;
            }

            try {
                // Verify token validity with backend
                const response = await fetch(API_ENDPOINTS.VALIDATE_TOKEN, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    // Token invalid or expired
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    setIsAuthenticated(false);
                    navigate('/admin');
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                setIsAuthenticated(false);
                navigate('/admin');
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    // If not authenticated, show loading screen while redirecting (prevents flash of content)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;

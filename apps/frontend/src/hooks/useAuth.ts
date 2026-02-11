import { useState, useCallback } from 'react';

interface AuthState {
    token: string | null;
    username: string | null;
    name: string | null;
    role: string | null;
    isAuthenticated: boolean;
}

/**
 * Centralized authentication hook for managing JWT tokens and user state
 * Provides a single source of truth for authentication across the application
 */
export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        token: sessionStorage.getItem('adminToken'),
        username: sessionStorage.getItem('adminUsername'),
        name: sessionStorage.getItem('adminName'),
        role: sessionStorage.getItem('adminRole'),
        isAuthenticated: !!sessionStorage.getItem('adminToken'),
    });

    // Get token from sessionStorage
    const getToken = useCallback((): string | null => {
        return authState.token;
    }, [authState.token]);

    // Set token and related user info
    const setToken = useCallback((token: string, username: string, name: string, role: string) => {
        sessionStorage.setItem('adminToken', token);
        sessionStorage.setItem('adminUsername', username);
        sessionStorage.setItem('adminName', name);
        sessionStorage.setItem('adminRole', role);

        setAuthState({
            token,
            username,
            name,
            role,
            isAuthenticated: true,
        });
    }, []);

    // Remove token and clear user info (logout)
    const removeToken = useCallback(() => {
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminUsername');
        sessionStorage.removeItem('adminName');
        sessionStorage.removeItem('adminRole');

        setAuthState({
            token: null,
            username: null,
            name: null,
            role: null,
            isAuthenticated: false,
        });
    }, []);

    // Check if user has a specific role
    const hasRole = useCallback((requiredRole: string): boolean => {
        return authState.role === requiredRole;
    }, [authState.role]);

    // Check if user has any of the specified roles
    const hasAnyRole = useCallback((roles: string[]): boolean => {
        return authState.role ? roles.includes(authState.role) : false;
    }, [authState.role]);

    // Validate token expiration (you can implement JWT decode here if needed)
    const isTokenValid = useCallback((): boolean => {
        // TODO: Implement proper JWT validation with expiration check
        return !!authState.token;
    }, [authState.token]);

    return {
        token: authState.token,
        username: authState.username,
        name: authState.name,
        role: authState.role,
        isAuthenticated: authState.isAuthenticated,
        getToken,
        setToken,
        removeToken,
        hasRole,
        hasAnyRole,
        isTokenValid,
    };
};

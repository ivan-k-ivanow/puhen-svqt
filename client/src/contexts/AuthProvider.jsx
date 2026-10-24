import { useEffect, useState } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    setUser(null);
                    return;
                } else {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Failed to check authentication', error);
            } finally {
                setIsLoading(false);
            }
        };
        getUser();
    }, []);


    const logout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
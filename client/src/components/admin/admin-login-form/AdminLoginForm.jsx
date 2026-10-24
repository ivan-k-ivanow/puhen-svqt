import { useNavigate } from 'react-router';
import { useState } from 'react';
import useAuth from '../../../contexts/useAuth';

export default function AdminLoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Грешка при вход');
            } else {
                setUser(data.user);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }; 

    return (
        <section id="login" className="admin-section active">
            <h2>Админ вход</h2>
            <form
                id="login-form"
                action="/admin/login"
                method="POST"
                className="admin-form"
                onSubmit={handleSubmit}
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Имейл"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Парола"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={isLoading}>{isLoading ? 'Зареждане...' : 'Вход'}</button>

            </form>

        </section>
    );
}
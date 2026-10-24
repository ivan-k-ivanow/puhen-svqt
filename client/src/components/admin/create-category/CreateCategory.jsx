import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function CreateCategoryForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/categories/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            }
            );

            const data = await response.json();

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Грешка при създаване на категория');
                return;
            }

            setSuccess('Категорията е създадена успешно');
            setName('');
        } catch (error) {
            console.error('Error creating category:', error);
            setError('Грешка при създаване на категория');
        }
    }
    return (
        <>
            <section id="add-category" className="admin-section active">
                <h2>Създай Категория</h2>

                <form id="category-form" className="admin-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Име на категория"
                        maxLength="50" required value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}

                    <div className="category-form-actions">
                        <button type="submit">Създай Категория</button>

                        <button
                            type="button"
                            className="admin-nav-btn"
                            onClick={() => navigate("/admin/products/create")}
                        >
                            Отказ
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createCategory } from '../../../services/categories';
import CategoryList from './category-list/CategoryList';
import './CreateCategory.css';

export default function CreateCategoryForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        try {
            const data = await createCategory(name);
            setSuccess('Категорията е създадена успешно');
            setName('');
            setRefreshTrigger(prev => !prev);
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

                    <CategoryList refreshTrigger={refreshTrigger} />

                    <div className="category-form-actions">
                        <button type="submit">Създай Категория</button>

                        <button
                            type="button"
                            className="admin-nav-btn"
                            onClick={() => navigate("/admin/dashboard")}
                        >
                            Отказ
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}


import { useEffect, useState } from 'react';

export default function CategoryList({
    refreshTrigger
}) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCategories = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/categories`,
                {
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                throw new Error('Грешка при зареждането на категориите.');
            }

            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, [refreshTrigger]);

    const deleteCategory = async (categoryId) => {
        const confirmed = window.confirm(
            'Сигурни ли сте, че искате да изтриете тази категория?'
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/categories/delete/${categoryId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));

                throw new Error(
                    data.error || 'Грешка при изтриването на категорията.'
                );
            }

            setCategories(currentCategories =>
                currentCategories.filter(
                    category => category.id !== categoryId
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <p>Зареждане на категориите...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="category-section">
            <h3>Категории</h3>

            <div className="category-checkboxes">
                {categories.map(category => (
                    <div className="create-category-item" key={category.id}>
                        <span>{category.name}</span>

                        <button
                            type="button"
                            className="create-category-delete-btn"
                            onClick={() => deleteCategory(category.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

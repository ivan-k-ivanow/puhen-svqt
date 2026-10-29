
import { useEffect, useState } from 'react';
import '../../categories/Categories.css';
import './CategoryList.css';
import { getCategories, deleteCategory } from '../../../../services/categories';

export default function CategoryList({
    refreshTrigger
}) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadCategories();
    }, [refreshTrigger]);

    const handleDeleteCategory = async (categoryId) => {
        const confirmed = window.confirm(
            'Сигурни ли сте, че искате да изтриете тази категория?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteCategory(categoryId);
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
                            onClick={() => handleDeleteCategory(category.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

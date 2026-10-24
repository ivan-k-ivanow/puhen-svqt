import { useEffect, useState } from 'react';

export default function Categories({
    selectedCategories = []
}) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categories`, {
                credentials: 'include'
            });

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
    }, []);

    if (isLoading) {
        return <p>Зареждане на категориите...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }


    return (
        <div className="category-section">
            <h3>Категории</h3>

            <div className="category-checkboxes">
                {categories.map(category => {
                    const isSelected = selectedCategories.some(
                        selectedCategory => selectedCategory.id === category.id
                    );
                    return (
                        <div className="category-item" key={category.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="categoryIds"
                                    value={category.id}
                                    defaultChecked={isSelected}
                                />
                                <span>{category.name}</span>
                            </label>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
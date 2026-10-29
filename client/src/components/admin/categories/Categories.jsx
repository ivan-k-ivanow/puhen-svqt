import { useEffect, useState } from 'react';
import './Categories.css';
import { getCategories } from '../../../services/categories';

export default function Categories({
    selectedCategories = [],
    onChange,
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
                    const isSelected = selectedCategories.includes(category.id);
                    return (
                        <div className="category-item" key={category.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="categoryIds"
                                    value={category.id}
                                    defaultChecked={isSelected}
                                    onChange={(event) => {
                                        onChange?.(category.id, event.target.checked);
                                    }}
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
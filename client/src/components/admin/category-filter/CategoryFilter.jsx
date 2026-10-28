import "./CategoryFilter.css";

export default function CategoryFilter({
    categories,
    selectedCategory,
    onCategoryChange
}) {
    return (
        <select
            id="admin-category-filter"
            value={selectedCategory}
            onChange={event => onCategoryChange(event.target.value)}
        >
            <option value="">Всички категории</option>

            {categories.map(category => (
                <option key={category.id} value={category.id}>
                    {category.name}
                </option>
            ))}
        </select>
    );
}
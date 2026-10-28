import "./ProductFilters.css";

export default function ProductFilters({
    categories,
    selectedCategory,
    onCategoryChange,
}) {
    return (
        <div className="products-filters">
            <button
                type="button"
                className={`product-filter ${
                    selectedCategory === "all" ? "active" : ""
                }`}
                onClick={() => onCategoryChange("all")}
            >
                Всички
            </button>

            {categories.map((category) => (
                <button
                    type="button"
                    key={category.id}
                    className={`product-filter ${
                        selectedCategory === category.id ? "active" : ""
                    }`}
                    onClick={() => onCategoryChange(category.id)}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
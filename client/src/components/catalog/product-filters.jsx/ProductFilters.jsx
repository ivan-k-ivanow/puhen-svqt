import "./ProductFilters.css";

export default function ProductFilters({
    categories,
    totalCount,
    selectedCategory,
    onCategoryChange,
}) {
    const chips = [
        { id: "all", name: "Всички", count: totalCount },
        ...categories,
    ];

    return (
        <div className="products-filters" role="group" aria-label="Категории">
            {chips.map((category) => {
                const active = selectedCategory === category.id;

                return (
                    <button
                        type="button"
                        key={category.id}
                        className={`product-filter ${active ? "active" : ""}`}
                        aria-pressed={active}
                        onClick={() => onCategoryChange(category.id)}
                    >
                        <span>{category.name}</span>
                        <span className="product-filter-count">
                            {category.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

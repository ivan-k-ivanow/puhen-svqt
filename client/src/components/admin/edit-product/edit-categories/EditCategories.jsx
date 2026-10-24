export default function EditCategories({
    product
}) {
    return (
                           <div className="category-section">
                        <h3>Категории</h3>

                        <div className="category-checkboxes">
                            {product.categories?.map(category => (
                                <div className="category-item" key={category.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="categoryIds"
                                            value={category.id}
                                            defaultChecked
                                        />
                                        <span>{category.name}</span>
                                    </label>

                                    <button
                                        type="button"
                                        className="category-delete-btn"
                                        data-category-id={category.id}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="category-actions">
                            <a
                                href="/admin/categories/create"
                                className="create-category-btn"
                            >
                                + Създай категория
                            </a>
                        </div>
                    </div>
    );
}
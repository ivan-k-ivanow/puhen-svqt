export default function ProductTable() {
    return (
            <div id="manage-products" className="admin-section">
                <h2>Всички Продукти</h2>

                <div id="toast-update" className="toast hidden"></div>

                <div className="admin-filters">
                    <input
                        type="text"
                        id="admin-search"
                        placeholder="Търси по име..."
                    />

                    <select id="admin-category-filter">
                        <option value="">Всички категории</option>
                        <option value="birthday">Рожден ден</option>
                        <option value="christening">Кръщене</option>
                        <option value="wedding">Сватба</option>
                        <option value="anniversary">Годишнина</option>
                        <option value="teacher">Учител</option>
                        <option value="other">Други</option>
                    </select>
                </div>

                <ul id="products-list">
                    <li className="admin-product">
                        <span className="drag-handle">☰</span>

                        <img
                            src="https://placehold.co/100x100?text=Product"
                            alt="Букет от пухена тел"
                            className="admin-product-image"
                            style={{ cursor: 'zoom-in' }}
                        />

                        <div className="admin-product-info">
                            <strong>Букет от пухена тел</strong>

                            <p>
                                <b>Категории:</b> Рожден ден, Други
                            </p>

                            <p>
                                <b>Снимки:</b> 2
                            </p>

                            <p>
                                <b>Цена:</b> 25 €.
                            </p>
                        </div>

                        <div className="admin-product-actions">
                            <a
                                href="/admin/products/edit"
                                className="edit-product"
                            >
                                Редактирай
                            </a>

                            <button
                                type="button"
                                className="delete-product"
                                data-id="1"
                            >
                                Премахни Продукт
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }

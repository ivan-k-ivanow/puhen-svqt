export default function EditProduct() {
    return (
        <>
            <section id="edit-product" className="admin-section">
                <h2>Редактирай Продукт</h2>

                <form
                    id="product-form"
                    className="admin-form"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <input
                        name="name"
                        placeholder="Име на продукт"
                        defaultValue="Букет от пухена тел"
                        required
                    />

                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Цена"
                        defaultValue="25.00"
                        required
                    />

                    <div className="product-images">
                        <h3>Снимки на продукта</h3>

                        <div className="image-preview-container">
                            <div className="preview-wrapper">
                                <img
                                    src="https://placehold.co/200x200?text=Image+1"
                                    alt="Букет от пухена тел"
                                    className="image-preview"
                                />
                                <button
                                    type="button"
                                    className="preview-remove-btn"
                                    data-image-id="1"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="preview-wrapper">
                                <img
                                    src="https://placehold.co/200x200?text=Image+2"
                                    alt="Букет от пухена тел"
                                    className="image-preview"
                                />
                                <button
                                    type="button"
                                    className="preview-remove-btn"
                                    data-image-id="2"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    </div>

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        id="image-input"
                        style={{ display: 'none' }}
                    />

                    <label
                        htmlFor="image-input"
                        className="image-upload-btn"
                    >
                        + Добави снимка
                    </label>

                    <div className="category-section">
                        <h3>Категории</h3>

                        <div className="category-checkboxes">
                            <div className="category-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="categoryIds"
                                        value="1"
                                        defaultChecked
                                    />
                                    <span>Рожден ден</span>
                                </label>

                                <button
                                    type="button"
                                    className="category-delete-btn"
                                    data-category-id="1"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="category-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="categoryIds"
                                        value="2"
                                        defaultChecked
                                    />
                                    <span>Кръщене</span>
                                </label>

                                <button
                                    type="button"
                                    className="category-delete-btn"
                                    data-category-id="2"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="category-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="categoryIds"
                                        value="3"
                                    />
                                    <span>Сватба</span>
                                </label>

                                <button
                                    type="button"
                                    className="category-delete-btn"
                                    data-category-id="3"
                                >
                                    ×
                                </button>
                            </div>
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

                    <textarea
                        name="shortDescription"
                        placeholder="Кратко описание (за каталога)"
                        maxLength={100}
                        defaultValue="Красив ръчно изработен букет."
                    />

                    <textarea
                        name="description"
                        placeholder="Описание (за продуктовата страница)"
                        defaultValue="Оригинален букет от пухена тел, изработен ръчно с обич."
                    />

                    <button type="submit">
                        Запази Промените
                    </button>

                    <div id="toast-edit" className="toast hidden"></div>
                </form>
            </section>
        </>
    );
}
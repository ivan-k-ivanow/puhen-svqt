export default function CreateProduct() {
    return (
        <>
            <section id="add-product" className="admin-section">
                <h2>Добави Продукт</h2>

                <form
                    id="product-form"
                    className="admin-form"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <input
                        name="name"
                        placeholder="Име на продукт"
                        required
                    />

                    <input
                        name="price"
                        type="number"
                        placeholder="Цена"
                    />

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        id="image-input"
                        style={{ display: 'none' }}
                    />

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
                    />

                    <textarea
                        name="description"
                        placeholder="Описание (за продуктовата страница)"
                    />

                    <button type="submit">
                        Добави Продукта
                    </button>

                    <div id="toast-add" className="toast hidden"></div>
                </form>
            </section>
        </>
    );
}


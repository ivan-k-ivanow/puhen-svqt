import { useState, useEffect } from 'react';

export default function ProductTable() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getProducts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError(error);
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);


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
                    {isLoading && <li>Зареждане...</li>}
                    {error && <li className="error-message">{error.message}</li>}

                    {!isLoading && !error && products.length === 0 && <li>Няма продукти</li>}

                    {!isLoading && !error && products.length > 0 && products.map(product => (
                        <li key={product.id} className="admin-product">
                            <span className="drag-handle">☰</span>

                            <img
                                src={
                                    product.images?.[0]?.url ||
                                    "/images/bouquet.jpg"
                                }
                                alt={product.name}
                                className="admin-product-image"
                                style={{ cursor: 'zoom-in' }}
                            />

                            <div className="admin-product-info">
                                <strong>{product.name}</strong>

                                <p>
                                    <b>Категории:</b> {product.categories.map(category => category.name).join(', ')}
                                </p>

                                <p>
                                    <b>Снимки:</b> {product.images.length}
                                </p>

                                <p>
                                    <b>Цена:</b> {product.price} €.
                                </p>
                            </div>

                            <div className="admin-product-actions">
                                <a
                                    href={`/admin/products/edit/${product.id}`}
                                    className="edit-product"
                                >
                                    Редактирай
                                </a>

                                <button
                                    type="button"
                                    className="delete-product"
                                    data-id={product.id}
                                >
                                    Премахни Продукт
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

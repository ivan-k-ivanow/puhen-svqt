import { useState, useEffect } from 'react';

export default function ProductTable() {
    const [products, setProducts] = useState([]);
    const [savedOrderIds, setSavedOrderIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingOrder, setIsSavingOrder] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const hasOrderChanges =
        products.length !== savedOrderIds.length ||
        products.some((product, index) => product.id !== savedOrderIds[index]);

    const getProducts = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/products`,
                { credentials: 'include' }
            );

            if (!response.ok) {
                throw new Error('Грешка при зареждането на продуктите.');
            }

            const data = await response.json();

            setProducts(data);
            setSavedOrderIds(data.map(product => product.id));
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

    const handleMoveProduct = (index, direction) => {
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= products.length) {
            return;
        }

        setProducts(previousProducts => {
            const reorderedProducts = [...previousProducts];

            [
                reorderedProducts[index],
                reorderedProducts[newIndex]
            ] = [
                reorderedProducts[newIndex],
                reorderedProducts[index]
            ];

            return reorderedProducts;
        });

        setMessage('');
    };

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        setMessage('');

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/products/reorder`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productIds: products.map(product => product.id)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Грешка при запазването на реда.'
                );
            }

            setSavedOrderIds(products.map(product => product.id));
            setMessage('Редът на продуктите е запазен успешно!');
        } catch (error) {
            console.error('Error saving product order:', error);
            setMessage(error.message);
        } finally {
            setIsSavingOrder(false);
        }
    };

    const handleCancelOrder = () => {
        setProducts(previousProducts => {
            const productsById = new Map(
                previousProducts.map(product => [product.id, product])
            );

            return savedOrderIds
                .map(id => productsById.get(id))
                .filter(Boolean);
        });

        setMessage('');
    };

    const handleDeleteProduct = productId => async () => {
        const confirmed = window.confirm(
            'Сигурни ли сте, че искате да изтриете този продукт?'
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/products/${productId}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error('Грешка при изтриването на продукта.');
            }

            setProducts(previous =>
                previous.filter(product => product.id !== productId)
            );

            setSavedOrderIds(previous =>
                previous.filter(id => id !== productId)
            );
        } catch (error) {
            console.error('Error deleting product:', error);
            setMessage(error.message);
        }
    };

    return (
        <div id="manage-products" className="admin-section">
            <h2>Администриране на продукти</h2>

            {message && (
                <p role="status" className="form-message">
                    {message}
                </p>
            )}

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

            {hasOrderChanges && (
                <div className="product-order-controls">
                    <button
                        type="button"
                        onClick={handleSaveOrder}
                        disabled={isSavingOrder}
                    >
                        {isSavingOrder ? 'Запазване...' : 'Запази реда'}
                    </button>

                    <button
                        type="button"
                        onClick={handleCancelOrder}
                        disabled={isSavingOrder}
                    >
                        Отмени
                    </button>
                </div>
            )}

            <ul id="products-list">
                {isLoading && <li>Зареждане...</li>}

                {error && (
                    <li className="error-message">{error.message}</li>
                )}

                {!isLoading && !error && products.length === 0 && (
                    <li>Няма продукти</li>
                )}

                {!isLoading && !error && products.map((product, index) => (
                    <li key={product.id} className="admin-product">
                        <div className="product-order-actions">
                            <button
                                type="button"
                                onClick={() => handleMoveProduct(index, -1)}
                                disabled={index === 0 || isSavingOrder}
                                aria-label={`Премести ${product.name} нагоре`}
                            >
                                ↑
                            </button>

                            <button
                                type="button"
                                onClick={() => handleMoveProduct(index, 1)}
                                disabled={
                                    index === products.length - 1 ||
                                    isSavingOrder
                                }
                                aria-label={`Премести ${product.name} надолу`}
                            >
                                ↓
                            </button>
                        </div>

                        <img
                            src={product.images?.[0]?.url || '/images/bouquet.jpg'}
                            alt={product.name}
                            className="admin-product-image"
                        />

                        <div className="admin-product-info">
                            <strong>{product.name}</strong>

                            <p>
                                <b>Категории:</b>{' '}
                                {product.categories
                                    .map(category => category.name)
                                    .join(', ')}
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
                                onClick={handleDeleteProduct(product.id)}
                                disabled={isSavingOrder}
                            >
                                Премахни продукт
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
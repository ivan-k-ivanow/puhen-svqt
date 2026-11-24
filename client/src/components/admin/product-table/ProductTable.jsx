import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
    getAdminProducts,
    reorderProducts,
    deleteProduct,
    setProductVisibility,
} from '../../../services/products';
import '../orders/orders.css';
import './ProductTable.css';

const SORTS = [
    { value: 'position', label: 'Ред в магазина' },
    { value: 'name', label: 'Име А–Я' },
    { value: 'price-asc', label: 'Цена – възходящо' },
    { value: 'price-desc', label: 'Цена – низходящо' },
];

const SHOW = [
    { value: '', label: 'Всички' },
    { value: 'visible', label: 'Видими в сайта' },
    { value: 'hidden', label: 'Скрити' },
    { value: 'personalized', label: 'С персонализация' },
];

function money(value) {
    return `${Number(value).toFixed(2).replace('.', ',')} €`;
}

function plural(count, one, many) {
    return `${count} ${count === 1 ? one : many}`;
}

function fieldCount(product) {
    return product._count?.fields ?? product.fields?.length ?? 0;
}

function ArrowIcon({ up }) {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={up ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} />
        </svg>
    );
}

export default function ProductTable() {
    const [products, setProducts] = useState([]);
    const [savedOrderIds, setSavedOrderIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingOrder, setIsSavingOrder] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [show, setShow] = useState('');
    const [sort, setSort] = useState('position');
    const [confirmingId, setConfirmingId] = useState(null);
    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAdminProducts();

                setProducts(data);
                setSavedOrderIds(data.map(product => product.id));
            } catch (fetchError) {
                console.error('Error fetching products:', fetchError);
                setError(fetchError.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const hasOrderChanges =
        products.length !== savedOrderIds.length ||
        products.some((product, index) => product.id !== savedOrderIds[index]);

    // Категориите с броя продукти във всяка, в реда, в който се срещат.
    const categories = useMemo(() => {
        const byId = new Map();

        for (const product of products) {
            for (const item of product.categories ?? []) {
                const entry = byId.get(item.id) ?? { ...item, count: 0 };
                entry.count += 1;
                byId.set(item.id, entry);
            }
        }

        return [...byId.values()];
    }, [products]);

    const query = search.trim().toLowerCase();

    const visibleProducts = useMemo(() => {
        const list = products.filter(product => {
            if (category && !product.categories?.some(item => item.id === category)) return false;
            if (query && !product.name.toLowerCase().includes(query)) return false;
            if (show === 'visible' && !product.isActive) return false;
            if (show === 'hidden' && product.isActive) return false;
            if (show === 'personalized' && fieldCount(product) === 0) return false;
            return true;
        });

        if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name, 'bg'));
        if (sort === 'price-asc') return [...list].sort((a, b) => Number(a.price) - Number(b.price));
        if (sort === 'price-desc') return [...list].sort((a, b) => Number(b.price) - Number(a.price));

        return list;
    }, [products, category, query, show, sort]);

    // Подреждаме само пълния списък – иначе не е ясно къде отива продуктът.
    const canReorder = sort === 'position' && !category && !query && !show && !isSavingOrder;

    const hiddenCount = products.filter(product => !product.isActive).length;
    const personalizedCount = products.filter(product => fieldCount(product) > 0).length;

    const handleMove = (productId, direction) => {
        setProducts(previous => {
            const index = previous.findIndex(product => product.id === productId);
            const newIndex = index + direction;

            if (index < 0 || newIndex < 0 || newIndex >= previous.length) {
                return previous;
            }

            const reordered = [...previous];
            [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];

            return reordered;
        });

        setNotice('');
    };

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        setError('');

        try {
            await reorderProducts(products.map(product => product.id));
            setSavedOrderIds(products.map(product => product.id));
            setNotice('Редът на продуктите е запазен.');
        } catch (saveError) {
            console.error('Error saving product order:', saveError);
            setError(saveError.message);
        } finally {
            setIsSavingOrder(false);
        }
    };

    const handleCancelOrder = () => {
        setProducts(previous => {
            const byId = new Map(previous.map(product => [product.id, product]));
            return savedOrderIds.map(id => byId.get(id)).filter(Boolean);
        });
    };

    const handleToggleVisibility = async (product) => {
        const isActive = !product.isActive;

        setBusyId(product.id);
        setError('');
        setProducts(previous =>
            previous.map(item => (item.id === product.id ? { ...item, isActive } : item))
        );

        try {
            await setProductVisibility(product.id, isActive);
        } catch (toggleError) {
            console.error('Error changing visibility:', toggleError);
            setError(toggleError.message);
            setProducts(previous =>
                previous.map(item => (item.id === product.id ? { ...item, isActive: !isActive } : item))
            );
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (product) => {
        setBusyId(product.id);
        setError('');

        try {
            await deleteProduct(product.id);
            setProducts(previous => previous.filter(item => item.id !== product.id));
            setSavedOrderIds(previous => previous.filter(id => id !== product.id));
            setNotice(`„${product.name}“ е изтрит.`);
        } catch (deleteError) {
            console.error('Error deleting product:', deleteError);
            setError(deleteError.message);
        } finally {
            setBusyId(null);
            setConfirmingId(null);
        }
    };

    const savedIndex = new Map(savedOrderIds.map((id, index) => [id, index]));
    const isFiltering = Boolean(category || query || show);

    return (
        <div className="orders-page product-admin">
            <div className="pt-top">
                <div>
                    <h2>Продукти</h2>
                    {!isLoading && !error && (
                        <p className="orders-muted">
                            {plural(products.length, 'продукт', 'продукта')}
                            {' · '}{products.length - hiddenCount} видими в сайта
                            {hiddenCount > 0 && ` · ${hiddenCount} скрити`}
                            {' · '}{personalizedCount} с персонализация
                        </p>
                    )}
                </div>

                <div className="pt-top-actions">
                    <Link to="/admin/categories/create" className="pt-ghost-btn">+ Категория</Link>
                    <Link to="/admin/products/create" className="orders-btn">+ Нов продукт</Link>
                </div>
            </div>

            {categories.length > 0 && (
                <div className="pt-tabs" role="group" aria-label="Категория">
                    <button
                        type="button"
                        className={`order-tab ${category === '' ? 'active' : ''}`}
                        aria-pressed={category === ''}
                        onClick={() => setCategory('')}
                    >
                        Всички
                        <span className="order-tab-count">{products.length}</span>
                    </button>

                    {categories.map(item => (
                        <button
                            type="button"
                            key={item.id}
                            className={`order-tab ${category === item.id ? 'active' : ''}`}
                            aria-pressed={category === item.id}
                            onClick={() => setCategory(item.id)}
                        >
                            {item.name}
                            <span className="order-tab-count">{item.count}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="pt-filters">
                <div className="pt-tabs-mobile">
                    <label htmlFor="pt-category" className="visually-hidden">Категория</label>
                    <select
                        id="pt-category"
                        className="orders-input"
                        value={category}
                        onChange={event => setCategory(event.target.value)}
                    >
                        <option value="">Всички категории ({products.length})</option>
                        {categories.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name} ({item.count})
                            </option>
                        ))}
                    </select>
                </div>

                <label htmlFor="pt-search" className="visually-hidden">Търсене</label>
                <input
                    id="pt-search"
                    type="search"
                    className="orders-input pt-search"
                    placeholder="Търси продукт по име"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                />

                <div className="pt-filter">
                    <label htmlFor="pt-show" className="orders-muted">Покажи</label>
                    <select id="pt-show" className="orders-input" value={show} onChange={event => setShow(event.target.value)}>
                        {SHOW.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                <div className="pt-filter">
                    <label htmlFor="pt-sort" className="orders-muted">Подреди по</label>
                    <select id="pt-sort" className="orders-input" value={sort} onChange={event => setSort(event.target.value)}>
                        {SORTS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {hasOrderChanges && (
                <div className="pt-savebar" role="status">
                    <span><b>Редът е променен.</b> Клиентите ще виждат продуктите в този ред, след като запазиш.</span>
                    <span className="pt-savebar-actions">
                        <button type="button" className="pt-savebar-cancel" onClick={handleCancelOrder} disabled={isSavingOrder}>
                            Отмени
                        </button>
                        <button type="button" className="pt-savebar-save" onClick={handleSaveOrder} disabled={isSavingOrder}>
                            {isSavingOrder ? 'Запазване...' : 'Запази реда'}
                        </button>
                    </span>
                </div>
            )}

            {notice && !hasOrderChanges && (
                <p className="pt-notice" role="status">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {notice}
                </p>
            )}

            {error && <p className="orders-message orders-message--error" role="alert">{error}</p>}

            <div className="orders-card pt-table">
                <div className="pt-row pt-row--head" aria-hidden="true">
                    <span>Ред</span>
                    <span>Продукт</span>
                    <span>Категории</span>
                    <span>Персонализация</span>
                    <span className="pt-price">Цена</span>
                    <span>В сайта</span>
                    <span />
                </div>

                {isLoading && <p className="pt-empty">Зареждане...</p>}

                {!isLoading && !error && products.length === 0 && (
                    <p className="pt-empty">Още няма продукти.</p>
                )}

                {!isLoading && products.length > 0 && visibleProducts.length === 0 && (
                    <p className="pt-empty">Няма продукти, които отговарят на търсенето.</p>
                )}

                {!isLoading && visibleProducts.map(product => {
                    const index = products.indexOf(product);
                    const fields = fieldCount(product);
                    const isConfirming = confirmingId === product.id;
                    const isBusy = busyId === product.id;
                    const moved = savedIndex.get(product.id) !== index;
                    const extraCategories = (product.categories ?? []).slice(2);

                    return (
                        <div
                            key={product.id}
                            className={`pt-row ${product.isActive ? '' : 'is-hidden'} ${moved ? 'is-moved' : ''}`}
                        >
                            <div className="pt-pos">
                                <span className="pt-pos-number" title="Място в магазина">{index + 1}</span>
                                <span className="pt-arrows">
                                    <button
                                        type="button"
                                        className="pt-arrow"
                                        onClick={() => handleMove(product.id, -1)}
                                        disabled={!canReorder || index === 0}
                                        aria-label={`Премести ${product.name} нагоре`}
                                    >
                                        <ArrowIcon up />
                                    </button>
                                    <button
                                        type="button"
                                        className="pt-arrow"
                                        onClick={() => handleMove(product.id, 1)}
                                        disabled={!canReorder || index === products.length - 1}
                                        aria-label={`Премести ${product.name} надолу`}
                                    >
                                        <ArrowIcon />
                                    </button>
                                </span>
                            </div>

                            <div className="pt-product">
                                {product.images?.[0]?.url ? (
                                    <img src={product.images[0].url} alt="" className="pt-thumb" loading="lazy" />
                                ) : (
                                    <span className="pt-thumb" aria-hidden="true" />
                                )}
                                <div className="pt-product-text">
                                    <Link to={`/admin/products/edit/${product.id}`} className="pt-name">
                                        {product.name}
                                    </Link>
                                    <span className="pt-sub">
                                        {product.shortDescription ? `${product.shortDescription.trim()} · ` : ''}
                                        {plural(product.images?.length ?? 0, 'снимка', 'снимки')}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-cats">
                                {(product.categories ?? []).slice(0, 2).map(item => (
                                    <span className="pt-chip" key={item.id}>{item.name}</span>
                                ))}
                                {extraCategories.length > 0 && (
                                    <span
                                        className="pt-chip pt-chip--more"
                                        title={extraCategories.map(item => item.name).join(', ')}
                                    >
                                        +{extraCategories.length}
                                    </span>
                                )}
                            </div>

                            <div className={`pt-pz ${fields > 0 ? '' : 'pt-pz--none'}`}>
                                {fields > 0 ? (
                                    <span className="pt-pz-badge">{plural(fields, 'поле', 'полета')}</span>
                                ) : (
                                    <span className="pt-pz-none" aria-label="Без персонализация">—</span>
                                )}
                            </div>

                            <div className="pt-price">{money(product.price)}</div>

                            <div className="pt-visibility">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={product.isActive}
                                    aria-label={`${product.name} се вижда в сайта`}
                                    className={`pt-switch ${product.isActive ? 'on' : ''}`}
                                    onClick={() => handleToggleVisibility(product)}
                                    disabled={isBusy}
                                >
                                    <span className="pt-switch-track" aria-hidden="true" />
                                    <span>{product.isActive ? 'Видим' : 'Скрит'}</span>
                                </button>
                            </div>

                            <div className="pt-actions">
                                {isConfirming ? (
                                    <div className="pt-confirm" role="group" aria-label={`Изтриване на ${product.name}`}>
                                        <button type="button" className="pt-confirm-yes" onClick={() => handleDelete(product)} disabled={isBusy}>
                                            {isBusy ? 'Изтриване...' : 'Да, изтрий'}
                                        </button>
                                        <button type="button" className="pt-confirm-no" onClick={() => setConfirmingId(null)} disabled={isBusy}>
                                            Не
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link to={`/admin/products/edit/${product.id}`} className="pt-edit">
                                            Редактирай
                                        </Link>
                                        {product.isActive ? (
                                            <a
                                                href={`/products/${product.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pt-icon-btn"
                                                aria-label={`Виж ${product.name} в сайта`}
                                                title="Виж в сайта"
                                            >
                                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M14 4h6v6" />
                                                    <path d="M20 4l-9 9" />
                                                    <path d="M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <span className="pt-icon-btn is-disabled" title="Скритите продукти не се виждат в сайта" aria-hidden="true">
                                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14 4h6v6" />
                                                    <path d="M20 4l-9 9" />
                                                    <path d="M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5" />
                                                </svg>
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            className="pt-icon-btn pt-icon-btn--danger"
                                            onClick={() => setConfirmingId(product.id)}
                                            aria-label={`Изтрий ${product.name}`}
                                            title="Изтрий"
                                        >
                                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!isLoading && products.length > 1 && (isFiltering || sort !== 'position') && (
                <p className="pt-hint">
                    Стрелките за подреждане работят при „Ред в магазина“, без търсене и филтри.
                </p>
            )}
        </div>
    );
}

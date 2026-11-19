import { Link, useParams } from 'react-router';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import SimilarProducts from './similar-products/SimilarProducts';
import ProductGallery from './product-gallery/ProductGallery';
import { getProductBySlug, getSimilarProducts } from '../../services/products';
import './ProductDetails.css';

// Абзацът за ръчната изработка се показва като отделна бележка под описанието,
// затова го махаме от самото описание, ако е написан там.
function cleanDescription(text) {
    return (text || '')
        .replace(/\r\n/g, '\n')
        .split(/\n\s*\n/)
        .filter((paragraph) => !paragraph.includes('Продуктите са ръчно изработени'))
        .join('\n\n')
        .trim();
}

function ProductDescription({ text }) {
    const description = cleanDescription(text);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLong, setIsLong] = useState(false);
    const descriptionRef = useRef(null);

    // Бутонът „Виж цялото описание“ се показва само ако текстът не се събира.
    useLayoutEffect(() => {
        const element = descriptionRef.current;
        if (!element || isExpanded) return;

        const check = () => setIsLong(element.scrollHeight > element.clientHeight + 4);
        check();

        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [description, isExpanded]);

    if (!description) {
        return null;
    }

    return (
        <div className="pd-about">
            <h2 className="pd-about-title">Описание</h2>

            <div
                id="product-description"
                ref={descriptionRef}
                className={`product-description ${isExpanded ? '' : 'clamped'} ${isLong ? 'is-long' : ''}`}
            >
                <ReactMarkdown>{description}</ReactMarkdown>
            </div>

            {isLong && (
                <button
                    type="button"
                    className="pd-more"
                    aria-expanded={isExpanded}
                    aria-controls="product-description"
                    onClick={() => setIsExpanded((value) => !value)}
                >
                    {isExpanded ? 'Скрий описанието' : 'Виж цялото описание'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={isExpanded ? 'rotated' : ''}>
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>
            )}

            <p className="pd-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 11v5M12 8h.01" />
                </svg>
                <span>Всеки продукт е ръчно изработен, затова може да има леки разлики спрямо снимките.</span>
            </p>
        </div>
    );
}

function ProductDetailsSkeleton() {
    return (
        <main className="product-details-page pd-loading" aria-busy="true" aria-label="Зареждане на продукта">
            <div className="pd-skeleton pd-skeleton-crumbs" />
            <div className="product-container">
                <div className="pd-skeleton pd-skeleton-image" />
                <div className="pd-skeleton-info">
                    <div className="pd-skeleton pd-skeleton-title" />
                    <div className="pd-skeleton pd-skeleton-line" />
                    <div className="pd-skeleton pd-skeleton-line short" />
                    <div className="pd-skeleton pd-skeleton-buttons" />
                    <div className="pd-skeleton pd-skeleton-text" />
                </div>
            </div>
        </main>
    );
}

export default function ProductDetails() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductBySlug(slug);
                setProduct(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchSimilarProducts = async () => {
            try {
                const data = await getSimilarProducts(slug);
                setSimilarProducts(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProduct();
        fetchSimilarProducts();
    }, [slug]);


    useEffect(() => {
        if (product?.id) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, [product?.id]);

    if (!product || product.slug !== slug) {
        return <ProductDetailsSkeleton />;
    }

    return (
        <main className="product-details-page">
            <nav className="pd-crumbs" aria-label="Навигация">
                <Link to="/">Начало</Link>
                <span aria-hidden="true">/</span>
                <Link to="/products">Продукти</Link>
                <span aria-hidden="true">/</span>
                <span className="pd-crumbs-current">{product.name}</span>
            </nav>

            <Link to="/products" className="pd-back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                Всички продукти
            </Link>

            <div className="product-container">
                <ProductGallery key={product.id} product={product} />

                <div className="product-info">
                    {/* 1. Какво е */}
                    <div className="pd-title">
                        <h1 className="product-name">{product.name}</h1>

                        {product.shortDescription && (
                            <p className="pd-lead">{product.shortDescription}</p>
                        )}

                        {product.categories?.length > 0 && (
                            <div className="pd-occasions">
                                <span className="pd-occasions-label">Подходящ за</span>
                                <div className="pd-chips">
                                    {product.categories.map((category) => (
                                        <span className="pd-chip" key={category.id}>
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Как се поръчва */}
                    <div className="pd-buy">
                        <div className="pd-facts">
                            <div className="pd-fact">
                                <span className="pd-fact-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 7v5l3 2" />
                                    </svg>
                                </span>
                                <span className="pd-fact-label">Изработка</span>
                                <span className="pd-fact-value">от 7 работни дни</span>
                            </div>

                            <div className="pd-fact">
                                <span className="pd-fact-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
                                        <circle cx="7" cy="18" r="1.8" />
                                        <circle cx="17.5" cy="18" r="1.8" />
                                    </svg>
                                </span>
                                <span className="pd-fact-label">Доставка</span>
                                <span className="pd-fact-value">Еконт / Спиди</span>
                            </div>
                        </div>

                        <div className="pd-cta">
                            <a
                                href="https://ig.me/m/puhensvqt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pd-btn pd-btn-main"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <rect x="2" y="2" width="20" height="20" rx="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                                </svg>
                                Поръчай в Instagram
                            </a>

                            <a
                                href="https://m.me/puhensvqt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pd-btn pd-btn-second"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.7v-2.9h2.7V9.6c0-2.7 1.6-4.2 4-4.2 1.2 0 2.4.2 2.4.2v2.6h-1.4c-1.4 0-1.8.9-1.8 1.7v2h3l-.5 2.9h-2.5v7A10 10 0 0 0 22 12z" />
                                </svg>
                                Поръчай във Facebook
                            </a>
                        </div>

                        <p className="pd-cta-hint">
                            Поръчките се приемат с лично съобщение – напиши ни името на продукта.
                        </p>
                    </div>

                    {/* 3. Описание */}
                    <ProductDescription key={product.id} text={product.description} />
                </div>
            </div>

            {similarProducts.length > 0 && (
                <section className="similar-section">
                    <div className="similar-head">
                        <h2>Подобни продукти</h2>
                        <Link to="/products" className="similar-all">
                            Всички продукти
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </Link>
                    </div>
                    <SimilarProducts similarProducts={similarProducts} />
                </section>
            )}
        </main>
    );
}

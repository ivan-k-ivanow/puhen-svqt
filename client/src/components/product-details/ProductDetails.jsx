import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import SimilarProducts from './similar-products/SimilarProducts';
import ProductGallery from './product-gallery/ProductGallery';
import PersonalizationForm from './personalization-form/PersonalizationForm';
import { validatePersonalization } from './personalization-form/validate-personalization';
import HowItWorks from '../how-it-works/HowItWorks';
import { getProductBySlug, getSimilarProducts } from '../../services/products';
import './ProductDetails.css';
import { productParams, trackMeta } from '../../utils/meta-pixel';

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

const FACTS = [
    {
        label: 'Визуализация',
        value: 'преди изработка',
        icon: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
    },
    {
        label: 'Изработка',
        value: 'до 7 работни дни',
        icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    },
    {
        label: 'Доставка',
        value: 'Еконт',
        icon: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></>,
    },
    {
        label: 'Плащане',
        value: 'при получаване',
        icon: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 10v4M18 10v4" /></>,
    },
];

function OrderCta({ onOrder, product }) {
    // Броим в Meta колко хора избират да поръчат с лично съобщение.
    const trackContact = (channel) => {
        trackMeta('Contact', { ...productParams(product), content_category: channel });
    };

    return (
        <div className="pd-cta-block">
            <button type="button" className="pd-btn pd-btn-main" onClick={onOrder}>
                Продължи към поръчката
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
            </button>

            <div className="pd-alt pd-alt--box">
                <p className="pd-alt-title">Поръчай с лично съобщение и ще уточним всичко заедно</p>
                <a
                    href="https://m.me/puhensvqt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-btn pd-btn-alt"
                    onClick={() => trackContact('Messenger')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C6.4 2 2 6.1 2 11.6c0 2.9 1.2 5.4 3.2 7.1V22l3-1.7c1.2.3 2.5.5 3.8.5 5.6 0 10-4.1 10-9.6S17.6 2 12 2zm1 12.9-2.5-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7-5.5 5.8z" />
                    </svg>
                    Поръчай през Messenger
                </a>
                <a
                    href="https://ig.me/m/puhensvqt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-btn pd-btn-alt"
                    onClick={() => trackContact('Instagram')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                    </svg>
                    Поръчай през Instagram
                </a>
            </div>
        </div>
    );
}

// Дясната колона: име, персонализация, бутон за поръчка и важните неща.
function ProductOrderPanel({ product }) {
    const navigate = useNavigate();
    const fields = product.fields ?? [];
    const [values, setValues] = useState({});
    const [files, setFiles] = useState({});
    const [errors, setErrors] = useState({});

    const clearError = (fieldId) => {
        setErrors(previous => {
            if (!previous[fieldId]) return previous;
            const next = { ...previous };
            delete next[fieldId];
            return next;
        });
    };

    const handleOrder = () => {
        const found = validatePersonalization(fields, values, files);
        setErrors(found);

        const firstInvalid = fields.find(field => found[field.id]);

        if (firstInvalid) {
            const element = document.getElementById(`pz-${firstInvalid.id}`);
            element?.closest('.pz-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element?.focus({ preventScroll: true });
            return;
        }

        trackMeta('InitiateCheckout', { ...productParams(product), num_items: 1 });

        navigate('/order', {
            state: {
                product: {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    shortDescription: product.shortDescription,
                    price: product.price,
                    image: product.images?.[0]?.url ?? null,
                },
                personalization: fields.map(field => ({
                    field,
                    value: values[field.id] ?? '',
                    files: files[field.id] ?? [],
                })),
            },
        });
    };

    return (
        <div className={`product-info ${fields.length === 0 ? 'is-compact' : ''}`}>
            <div className="pd-title">
                <h1 className="product-name">{product.name}</h1>

                {product.shortDescription && (
                    <p className="pd-lead">{product.shortDescription}</p>
                )}

                {Number(product.price) > 0 && (
                    <p className="pd-price">{Number(product.price).toFixed(2).replace('.', ',')} €</p>
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

            {fields.length > 0 ? (
                <section className="pd-pz" aria-labelledby="pd-pz-title">
                    <h2 id="pd-pz-title" className="pd-pz-title">Персонализирай подаръка</h2>

                    <PersonalizationForm
                        fields={fields}
                        values={values}
                        files={files}
                        errors={errors}
                        onValueChange={(fieldId, value) => {
                            setValues(previous => ({ ...previous, [fieldId]: value }));
                            clearError(fieldId);
                        }}
                        onFilesChange={(fieldId, list) => {
                            setFiles(previous => ({ ...previous, [fieldId]: list }));
                            clearError(fieldId);
                        }}
                    />

                    <OrderCta onOrder={handleOrder} product={product} />
                </section>
            ) : (
                <OrderCta onOrder={handleOrder} product={product} />
            )}

            <div className="pd-facts">
                {FACTS.map(fact => (
                    <div className="pd-fact" key={fact.label}>
                        <span className="pd-fact-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                {fact.icon}
                            </svg>
                        </span>
                        <span className="pd-fact-label">{fact.label}</span>
                        <span className="pd-fact-value">{fact.value}</span>
                    </div>
                ))}
            </div>
        </div>
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

    useEffect(() => {
        if (product?.id && product.slug === slug) {
            trackMeta('ViewContent', productParams(product));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <ProductGallery key={`gallery-${product.id}`} product={product} />

                <ProductOrderPanel key={`order-${product.id}`} product={product} />

                {/* Описанието е под снимките на десктоп и под поръчката на мобилно */}
                <ProductDescription key={`description-${product.id}`} text={product.description} />
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

            <HowItWorks />
        </main>
    );
}

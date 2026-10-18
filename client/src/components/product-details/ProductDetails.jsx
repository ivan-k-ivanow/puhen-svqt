import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

export default function ProductDetails() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${slug}`);
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProduct();
    }, [slug]);

    if (!product) {
        return null;
    }

    return (
        <>

            <main className="product-details-page">
                <div className="product-container">
                    <h1 className="product-name-mobile">
                        {product.name}
                    </h1>

                    {/* <!-- Gallery --> */}
                    <div className="gallery">
                        <div className="gallery-main">
                            <img
                                id="main-image"
                                src={product.images[0].url}
                                alt={product.name}
                            />
                        </div>

                        <div className="gallery-thumbs">
                            <div className="thumb active">
                                <img
                                    src={product.images[0].url}
                                    alt={product.name}
                                />
                            </div>
                        </div>
                    </div>

                    {/* <!-- Product information --> */}
                    <div className="product-info">
                        <h1 className="product-name">
                            {product.name}
                        </h1>

                        {product.categories?.length > 0 && (
                            <div className="product-categories">
                                {product.categories.map((category) => (
                                    <span
                                        className="product-category"
                                        key={category.id}
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <hr className="product-divider" />

                        <p className="product-description">
                            {product.description}
                        </p>

                        <div className="product-price-block">
                            <span className="product-price-label">
                                Цена
                            </span>
                            <div>
                                <span className="product-price">
                                    {product.price} €
                                </span>
                            </div>
                        </div>

                        <a
                            href="https://ig.me/m/puhensvqt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="order-link"
                        >
                            <button className="order-btn">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    stroke-width="2"
                                >
                                    <rect
                                        x="2"
                                        y="2"
                                        width="20"
                                        height="20"
                                        rx="5"
                                        ry="5"
                                    />
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="4"
                                    />
                                    <circle
                                        cx="17.5"
                                        cy="6.5"
                                        r="1.5"
                                        fill="white"
                                        stroke="none"
                                    />
                                </svg>
                                Поръчай в Instagram
                            </button>
                        </a>

                        <a
                            href="https://m.me/puhensvqt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="order-link"
                        >
                            <button className="order-btn">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="white"
                                >
                                    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.7v-2.9h2.7V9.6c0-2.7 1.6-4.2 4-4.2 1.2 0 2.4.2 2.4.2v2.6h-1.4c-1.4 0-1.8.9-1.8 1.7v2h3l-.5 2.9h-2.5v7A10 10 0 0 0 22 12z" />
                                </svg>
                                Поръчай във Facebook
                            </button>
                        </a>
                    </div>
                </div>

                {/* <!-- Similar products --> */}
                <div className="similar-section">
                    <hr className="similar-divider" />

                    <h2>
                        Подобни продукти
                    </h2>

                    <div className="similar-grid">
                        <a
                            href="/product/vaza-za-uchitel"
                            className="similar-card"
                        >
                            <img
                                src="https://ijfnibceycvvjkpoyddr.supabase.co/storage/v1/object/public/product-images/teacher-vase-1.jpg"
                                alt="Ваза за Учител"
                            />

                            <div className="similar-card-body">
                                <h3>
                                    Ваза за Учител
                                </h3>
                                <p>
                                    Нежна ръчно изработена ваза с вечни лалета
                                    и маргаритки, придружена от картичка с пожелание.
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </main>

        </>
    );
}
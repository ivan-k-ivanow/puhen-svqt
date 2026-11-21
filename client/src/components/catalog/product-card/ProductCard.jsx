import { Link } from "react-router";
import "./ProductCard.css";

export default function ProductCard({ product }) {
    const category = product.categories?.[0]?.name;

    return (
        <Link to={`/products/${product.slug}`} className="product-card">
            <div className="product-card-media">
                <img
                    src={product.images?.[0]?.url || "/images/bouquet.jpg"}
                    alt={product.name}
                    loading="lazy"
                />

                {category && (
                    <span className="product-card-tag">{category}</span>
                )}

                <span className="product-card-cta">Виж продукта</span>
            </div>

            <div className="product-card-body">
                <h3 className="product-card-name">{product.name}</h3>

                {product.shortDescription && (
                    <p className="product-card-desc">
                        {product.shortDescription}
                    </p>
                )}

                <p className="product-card-price">{product.price} €</p>

                <span className="product-card-link">
                    Поръчай
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}

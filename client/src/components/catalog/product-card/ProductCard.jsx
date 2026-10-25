
import { Link } from "react-router";

export default function ProductCard({ product }) {
    return (
        <Link
            to={`/products/${product.slug}`}>
            <article className="product-card">
                <div className="product-image-container">
                    <img
                        src={
                            product.images?.[0]?.url ||
                            "/images/bouquet.jpg"
                        }
                        alt={product.name}
                        className="product-image"
                    />
                </div>

                <div className="product-info">
                    <h3 className="product-name">
                        {product.name}
                    </h3>

                    <p className="product-description">
                        {product.shortDescription}
                    </p>

                    {/* <p className="product-price">
                        {product.price} €
                    </p> */}

                    <div

                        className="product-button"
                    >
                        Виж продукта
                    </div>
                </div>
            </article>
        </Link>
    );
}

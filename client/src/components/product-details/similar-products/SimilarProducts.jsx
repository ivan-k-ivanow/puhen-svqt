import { Link } from "react-router";

export default function SimilarProducts({
    similarProducts
}) {
    return (
        <div className="similar-grid">
            {similarProducts.map((product) => (
                <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="similar-card"
                >
                    <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                    />
                    <div className="similar-card-body">
                        <h3>
                            {product.name}
                        </h3>
                        <p>
                            {product.shortDescription}
                        </p>
                        <div
                            className="product-button"
                        >
                            Виж продукта
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
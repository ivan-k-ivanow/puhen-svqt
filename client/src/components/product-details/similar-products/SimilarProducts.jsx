import ProductCard from "../../catalog/product-card/ProductCard";
import "./SimilarProducts.css";

export default function SimilarProducts({ similarProducts }) {
    return (
        <div className="similar-grid">
            {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

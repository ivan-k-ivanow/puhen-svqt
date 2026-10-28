import { useEffect, useState } from "react";
import ProductCard from "./product-card/ProductCard";
import ProductFilters from "./product-filters.jsx/ProductFilters";
import "./Catalog.css";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        ...new Map(
            products
                .flatMap((product) => product.categories ?? [])
                .map((category) => [category.id, category])
        ).values(),
    ];

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter((product) =>
                product.categories?.some(
                    (category) => category.id === selectedCategory
                )
            );

    return (
        <>
            <section className="products" id="products">
                <div className="products-header">
                    <h2>Нашите продукти</h2>

                    <p>
                        Открийте ръчно изработени подаръци за
                        специалните моменти в живота.
                    </p>

                    <ProductFilters
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                </div>

                <div className="products-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard product={product} key={product.id} />
                    ))}

                    {filteredProducts.length === 0 && (
                        <p>Няма продукти в тази категория.</p>
                    )}
                </div>
            </section>
        </>
    );
}
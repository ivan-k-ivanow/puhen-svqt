import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState([]);

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

    return (
        <>
            <section className="products" id="products">
                <div className="products-header">
                    <h2>Нашите продукти</h2>

                    <p>
                        Открийте ръчно изработени подаръци за
                        специалните моменти в живота.
                    </p>

                    <div className="products-filters">
                        <button className="product-filter">
                            Всички
                        </button>

                        <button className="product-filter">
                            Букети
                        </button>

                        <button className="product-filter">
                            Подаръци
                        </button>
                    </div>
                </div>

                <div className="products-grid">
                    {products.map((product) => (
                        <article className="product-card" key={product.id}>
                            <div className="product-image-container">
                                <img
                                    src={product.images[0]?.url || "/images/bouquet.jpg"}
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

                                <p className="product-price">{product.price} лв.</p>

                                <a href="#" className="product-button">
                                    Виж продукта
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
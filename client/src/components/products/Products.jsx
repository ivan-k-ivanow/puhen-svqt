export default function Products() {
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
                    <article className="product-card">
                        <div className="product-image-container">
                            <img
                                src="/images/bouquet.jpg"
                                alt="Ръчно изработен букет"
                                className="product-image"
                            />
                        </div>

                        <div className="product-info">
                            <h3 className="product-name">
                                Ръчно изработен букет
                            </h3>

                            <p className="product-description">
                                Оригинален подарък за специален повод.
                            </p>

                            <p className="product-price">35 лв.</p>

                            <a href="#" className="product-button">
                                Виж продукта
                            </a>
                        </div>
                    </article>

                    <article className="product-card">
                        <div className="product-image-container">
                            <img
                                src="/images/gift.jpg"
                                alt="Персонализиран подарък"
                                className="product-image"
                            />
                        </div>

                        <div className="product-info">
                            <h3 className="product-name">
                                Персонализиран подарък
                            </h3>

                            <p className="product-description">
                                Подарък, създаден специално за любим човек.
                            </p>

                            <p className="product-price">25 лв.</p>

                            <a href="#" className="product-button">
                                Виж продукта
                            </a>
                        </div>
                    </article>
                </div>
            </section>
        </>
    );
}
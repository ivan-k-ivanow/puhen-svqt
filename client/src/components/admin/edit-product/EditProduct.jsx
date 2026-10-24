import Categories from '../categories/Categories';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

export default function EditProduct() {

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`,
                {
                    credentials: 'include'
                }
            );


            if (!response.ok) {
                throw new Error('Грешка при зареждането на продукта.');
            }
            const data = await response.json();
            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (isLoading) {
        return <p>Зареждане...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!product) {
        return <p>Продуктът не е намерен.</p>;
    }


    return (
        <>
            <section id="edit-product" className="admin-section">
                <h2>Редактирай Продукт</h2>

                <form
                    id="product-form"
                    className="admin-form"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <input
                        name="name"
                        placeholder="Име на продукт"
                        defaultValue={product.name}
                        required
                    />

                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Цена"
                        defaultValue={product.price}
                        required
                    />

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        id="image-input"
                        style={{ display: 'none' }}
                    />

                    <label
                        htmlFor="image-input"
                        className="image-upload-btn"
                    >
                        + Добави снимка
                    </label>

                    <div className="product-images">
                        <h3>Снимки на продукта</h3>

                        <div className="image-preview-container">
                            {product.images?.length > 0 ? (
                                product.images.map(image => (
                                    <div className="preview-wrapper" key={image.id}>
                                        <img
                                            src={image.url}
                                            alt={product.name}
                                            className="image-preview"
                                        />

                                        <button
                                            type="button"
                                            className="preview-remove-btn"
                                            data-image-id={image.id}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>Няма добавени снимки.</p>
                            )}
                        </div>

                    </div>


                    <Categories selectedCategories={product.categories} />

                    <textarea
                        name="shortDescription"
                        placeholder="Кратко описание (за каталога)"
                        maxLength={100}
                        defaultValue={product.shortDescription}
                    />

                    <textarea
                        name="description"
                        placeholder="Описание (за продуктовата страница)"
                        defaultValue={product.description}
                    />

                    <button type="submit">
                        Запази Промените
                    </button>

                </form>
            </section >
        </>
    );
}
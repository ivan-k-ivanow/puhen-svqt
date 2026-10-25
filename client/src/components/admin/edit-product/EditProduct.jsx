import Categories from '../categories/Categories';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import ImagePreview from '../image-preview/ImagePreview';
import ProductForm from '../product-form/ProductForm';

export default function EditProduct() {

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategories, setSelectedCategories] = useState([]);

    const [newImages, setNewImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

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
            setSelectedCategories(
                data.categories.map(category => category.id)
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (categoryId, isChecked) => {
        setSelectedCategories(previousIds => {
            if (isChecked) {
                return [...previousIds, categoryId];
            }

            return previousIds.filter(id => id !== categoryId);
        });
    };

    const handleAddImages = (files) => {
        setNewImages((previousImages) => [...previousImages, ...files
        ]);
    };

    const handleRemoveExistingImage = (imageId) => {
        setDeletedImageIds((previousImages) => [...previousImages, imageId]);
    };

    const handleRemoveNewImage = (index) => {
        setNewImages((previousImages) => previousImages.filter((_, i) => i !== index));
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        formData.delete('image');
        formData.delete('categoryIds');

        selectedCategories.forEach(categoryId => {
            formData.append('categoryIds', categoryId);
        });

        newImages.forEach(image => {
            formData.append('images', image);
        });

        formData.append('deletedImageIds', JSON.stringify(deletedImageIds));

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/products/${id}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Грешка при запазването на продукта.');
            }

            const updatedProduct = await response.json();

            setProduct(updatedProduct);
            setNewImages([]);
            setDeletedImageIds([]);
            setSelectedCategories(
                updatedProduct.categories.map(category => category.id)
            );

            setMessage('Промените са запазени успешно!');
            setMessageType('success');
        } catch (err) {
            console.error(err);
            setMessage(err.message);
            setMessageType('error');
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

                <ProductForm
                    product={product}
                    deletedImageIds={deletedImageIds}
                    newImages={newImages}
                    onAddImages={handleAddImages}
                    onRemoveExistingImage={handleRemoveExistingImage}
                    onRemoveNewImage={handleRemoveNewImage}
                    onCategoryChange={handleCategoryChange}
                    onSubmit={handleSubmit}
                    selectedCategories={selectedCategories}
                />
                {message && (
                    <p className={`form-message ${messageType}`} role="status">
                        {message}
                    </p>
                )}
            </section >
        </>
    );
}

import { useState } from 'react';
import ProductForm from '../product-form/ProductForm';

export default function CreateProduct() {
    const [newImages, setNewImages] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleCategoryChange = (categoryId, isChecked) => {
        setSelectedCategories(previousIds => {
            if (isChecked) {
                return [...previousIds, categoryId];
            }

            return previousIds.filter(id => id !== categoryId);
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        const formData = new FormData(event.currentTarget);

        formData.delete('image');
        formData.delete('categoryIds');

        selectedCategories.forEach(categoryId => {
            formData.append('categoryIds', categoryId);
        });

        newImages.forEach(image => {
            formData.append('images', image);
        });

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/admin/products`,
                {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Грешка при създаването на продукта.');
            }

            setMessage('Продуктът е добавен успешно!');
            setMessageType('success');
            setNewImages([]);
            setSelectedCategories([]);
            form.reset();
        } catch (err) {
            console.error(err);
            setMessage(err.message);
            setMessageType('error');
        }
    };

    return (
        <section id="add-product" className="admin-section">
            <h2>Добави продукт</h2>

            <ProductForm
                product={{
                    name: '',
                    price: '',
                    shortDescription: '',
                    description: '',
                    images: [],
                }}
                deletedImageIds={[]}
                newImages={newImages}
                selectedCategories={selectedCategories}
                onAddImages={(files) => {
                    setNewImages(previous => [...previous, ...files]);
                }}
                onRemoveExistingImage={() => { }}
                onRemoveNewImage={(index) => {
                    setNewImages(previous =>
                        previous.filter((_, i) => i !== index)
                    );
                }}
                onCategoryChange={handleCategoryChange}
                onSubmit={handleSubmit}
                submitLabel="Добави продукта"
            />
            {message && (
                <p className={`form-message ${messageType}`} role="status">
                    {message}
                </p>
            )}
        </section>
    );
}


import { useState } from 'react';
import ProductForm from '../product-form/ProductForm';
import { fieldsToPayload } from '../product-form/personalization-fields';
import { createProduct } from '../../../services/products';

export default function CreateProduct() {
    const [newImages, setNewImages] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [fields, setFields] = useState([]);
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

        formData.append('fields', JSON.stringify(fieldsToPayload(fields)));

        try {
            await createProduct(formData);

            setMessage('Продуктът е добавен успешно!');
            setMessageType('success');
            setNewImages([]);
            setSelectedCategories([]);
            setFields([]);
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
                fields={fields}
                onFieldsChange={setFields}
            />
            {message && (
                <p className={`form-message ${messageType}`} role="status">
                    {message}
                </p>
            )}
        </section>
    );
}

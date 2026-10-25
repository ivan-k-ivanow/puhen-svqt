
import Categories from '../categories/Categories';
import ImagePreview from '../image-preview/ImagePreview';

export default function ProductForm({
    product,
    deletedImageIds,
    newImages,
    onAddImages,
    onRemoveExistingImage,
    onRemoveNewImage,
    onCategoryChange,
    onSubmit,
    selectedCategories,
}) {
    return (
        <form
            id="product-form"
            className="admin-form"
            onSubmit={onSubmit}
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

            <ImagePreview
                existingImages={product.images.filter(
                    image => !deletedImageIds.includes(image.id)
                )}
                newImages={newImages}
                onAddImages={onAddImages}
                onRemoveExisting={onRemoveExistingImage}
                onRemoveNew={onRemoveNewImage}
            />

            <Categories
                selectedCategories={selectedCategories}
                onChange={onCategoryChange}
            />

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
                Запази промените
            </button>
        </form>
    );
}

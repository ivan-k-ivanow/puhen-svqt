
import { useEffect, useState } from 'react';

export default function ImagePreview({
    existingImages = [],
    newImages = [],
    onAddImages,
    onRemoveExisting,
    onRemoveNew,
}) {
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        const urls = newImages.map(file => URL.createObjectURL(file));

        setPreviews(urls);

        return () => {
            urls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [newImages]);

    return (
        <div className="product-images">
            <h3>Снимки на продукта</h3>

            <input
                type="file"
                id="image-input"
                accept="image/*"
                multiple
                hidden
                onChange={(event) => {
                    const files = Array.from(event.target.files);

                    if (files.length > 0) {
                        onAddImages(files);
                    }

                    event.target.value = '';
                }}
            />

            <label
                htmlFor="image-input"
                className="image-upload-btn"
            >
                + Добави снимка
            </label>

            <div className="image-preview-container">
                {existingImages.map(image => (
                    <div className="preview-wrapper" key={image.id}>
                        <img
                            src={image.url}
                            alt={image.alt || 'Снимка на продукта'}
                            className="image-preview"
                        />

                        <button
                            type="button"
                            className="preview-remove-btn"
                            onClick={() => onRemoveExisting(image.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}

                {previews.map((url, index) => (
                    <div className="preview-wrapper" key={url}>
                        <img
                            src={url}
                            alt={newImages[index]?.name || 'Нова снимка'}
                            className="image-preview"
                        />

                        <button
                            type="button"
                            className="preview-remove-btn"
                            onClick={() => onRemoveNew(index)}
                        >
                            ×
                        </button>
                    </div>
                ))}

                {existingImages.length === 0 && newImages.length === 0 && (
                    <p>Няма добавени снимки.</p>
                )}
            </div>
        </div>
    );
}

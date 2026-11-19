import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './ProductGallery.css';

const ArrowIcon = ({ direction }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </svg>
);

export default function ProductGallery({ product }) {
    const images = product.images ?? [];
    const count = images.length;
    const hasMany = count > 1;

    const [activeIndex, setActiveIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const nextImage = () => setActiveIndex((index) => (index + 1) % count);
    const prevImage = () => setActiveIndex((index) => (index - 1 + count) % count);

    // Един обработчик за клавиатурата, само докато голямата снимка е отворена.
    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsModalOpen(false);
            if (event.key === 'ArrowRight' && count > 1) setActiveIndex((index) => (index + 1) % count);
            if (event.key === 'ArrowLeft' && count > 1) setActiveIndex((index) => (index - 1 + count) % count);
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen, count]);

    if (count === 0) {
        return (
            <div className="gallery">
                <div className="gallery-main gallery-empty">Няма снимка</div>
            </div>
        );
    }

    const activeImage = images[activeIndex];

    return (
        <div className="gallery">
            <div className="gallery-main">
                <button
                    type="button"
                    className="gallery-open"
                    onClick={() => setIsModalOpen(true)}
                    aria-label="Отвори снимката в цял размер"
                >
                    <img src={activeImage.url} alt={product.name} />
                </button>

                {/* <span className="gallery-badge">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                    </svg>
                    Ръчна изработка
                </span> */}

                {hasMany && (
                    <>
                        <button type="button" className="gallery-arrow prev" onClick={prevImage} aria-label="Предишна снимка">
                            <ArrowIcon direction="left" />
                        </button>
                        <button type="button" className="gallery-arrow next" onClick={nextImage} aria-label="Следваща снимка">
                            <ArrowIcon direction="right" />
                        </button>
                        <span className="gallery-counter">
                            {activeIndex + 1} / {count}
                        </span>
                    </>
                )}
            </div>

            {hasMany && (
                <div className="gallery-thumbs">
                    {images.map((image, index) => (
                        <button
                            type="button"
                            key={image.id ?? index}
                            className={`thumb ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Снимка ${index + 1}`}
                        >
                            <img src={image.url} alt="" />
                        </button>
                    ))}
                </div>
            )}

            {/* Модалът се рендерира директно в <body>, за да е над всичко на страницата */}
            {isModalOpen && createPortal(
                <div
                    className="image-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={product.name}
                    onClick={() => setIsModalOpen(false)}
                >
                    <button
                        type="button"
                        className="modal-close"
                        onClick={() => setIsModalOpen(false)}
                        aria-label="Затвори"
                        autoFocus
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>

                    {hasMany && (
                        <button
                            type="button"
                            className="gallery-arrow prev modal-arrow"
                            onClick={(event) => { event.stopPropagation(); prevImage(); }}
                            aria-label="Предишна снимка"
                        >
                            <ArrowIcon direction="left" />
                        </button>
                    )}

                    <img
                        src={activeImage.url}
                        alt={product.name}
                        onClick={(event) => event.stopPropagation()}
                    />

                    {hasMany && (
                        <button
                            type="button"
                            className="gallery-arrow next modal-arrow"
                            onClick={(event) => { event.stopPropagation(); nextImage(); }}
                            aria-label="Следваща снимка"
                        >
                            <ArrowIcon direction="right" />
                        </button>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}

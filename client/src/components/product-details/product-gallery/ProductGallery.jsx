import { useState, useEffect } from 'react';
import './ProductGallery.css';

export default function ProductGallery({ product }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeThumb, setActiveThumb] = useState(0);

    const toggleModal = () => {
        setIsModalOpen((previousState) => !previousState);
    };


    const nextImage = () => {
        setActiveThumb((currentIndex) =>
            (currentIndex + 1) % product.images.length
        );
    };

    const prevImage = () => {
        setActiveThumb((currentIndex) =>
            (currentIndex - 1 + product.images.length) % product.images.length
        );
    };

    useEffect(() => {
        const rightArrowHandler = (event) => {
            if (event.key === 'ArrowRight') {
                nextImage();
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', rightArrowHandler);
        }

        return () => {
            window.removeEventListener('keydown', rightArrowHandler);
        };
    }, [isModalOpen]);

    useEffect(() => {
        const leftArrowHandler = (event) => {
            if (event.key === 'ArrowLeft') {
                prevImage();
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', leftArrowHandler);
        }

        return () => {
            window.removeEventListener('keydown', leftArrowHandler);
        };
    }, [isModalOpen]);



    useEffect(() => {
        if (!isModalOpen) return;

        const escapeKeyHandler = (event) => {
            if (event.key === 'Escape') {
                toggleModal();
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', escapeKeyHandler);
        }

        return () => {
            window.removeEventListener('keydown', escapeKeyHandler);
        };

    }, [isModalOpen]);

    return (
        <>
            {/* <!-- Gallery --> */}
            < div className="gallery" >
                <div className="gallery-main">

                    {product.images.length === 1 ? (
                        null
                    ) : (
                        <button className="prev-image" onClick={prevImage}>
                            &#10094;
                        </button>
                    )}


                    <img
                        id="main-image"
                        src={product.images[activeThumb].url}
                        alt={product.name}
                        onClick={toggleModal}
                    />

                    {product.images.length === 1 ? (
                        null
                    ) : (
                        <button className="next-image" onClick={nextImage}>
                            &#10095;
                        </button>
                    )}


                </div>

                {
                    isModalOpen && (
                        <div className="image-modal" onClick={toggleModal}>
                            <img
                                src={product.images[activeThumb].url}
                                alt={product.name}
                                onClick={(event) => event.stopPropagation()}
                            />
                        </div>
                    )
                }

                <div className="gallery-thumbs">
                    {product.images.map((image, index) => (
                        <div className={`thumb ${index === activeThumb ?
                            'active' : ''}`}
                            key={index}
                            onClick={() => setActiveThumb(index)}>
                            <img
                                src={image.url}
                                alt={product.name}
                            />
                        </div>
                    ))}
                </div>
            </div >
        </>
    );
}
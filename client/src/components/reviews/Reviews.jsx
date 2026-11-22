import { useState } from "react";
import { Link } from "react-router";
import "./Reviews.css";

// Снимки от клиенти, които са дали съгласие да ги публикуваме (лицата са скрити).
// Нов отзив: сложи квадратна снимка в client/public/images/reviews/ и добави ред тук.
// slug е адресът на продукта – страницата му е /products/<slug>.
const reviews = [
    {
        occasion: "Абитуриентски бал",
        product: "Букет „Абитуриентка“",
        slug: "buket-abiturientka",
        image: "/images/reviews/abiturientka.webp",
    },
    {
        occasion: "Първи учебен ден",
        product: "Букет за Учител",
        slug: "buket-za-uchitel",
        image: "/images/reviews/buket-za-uchitel.webp",
    },
    {
        occasion: "Рожден ден",
        product: "Светеща рамка",
        slug: "sveteshta-ramka",
        image: "/images/reviews/sveteshta-ramka.webp",
    },
];

// Колко отзива се виждат, преди да се натисне „Покажи още отзиви“.
const VISIBLE_COUNT = 3;

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function Stars() {
    return (
        <div className="reviews-stars" role="img" aria-label="5 от 5 звезди">
            {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={STAR_PATH} />
                </svg>
            ))}
        </div>
    );
}

export default function Reviews() {
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? reviews : reviews.slice(0, VISIBLE_COUNT);
    const hasMore = !showAll && reviews.length > VISIBLE_COUNT;

    return (
        <section className="reviews" id="reviews">
            <div className="reviews-header">
                <h2>Доволни клиенти</h2>
                <p>Подаръци, които вече стоплиха нечий дом.</p>
            </div>

            <div className="reviews-grid">
                {visible.map((review) => (
                    <article className="reviews-card" key={review.image}>
                        <span className="reviews-tape" aria-hidden="true" />

                        <Link
                            to={`/products/${review.slug}`}
                            className="reviews-photo"
                            aria-label={`Виж ${review.product}`}
                        >
                            <img
                                src={review.image}
                                alt=""
                                width="800"
                                height="800"
                                loading="lazy"
                                decoding="async"
                            />
                        </Link>

                        <div className="reviews-top">
                            <p className="reviews-occasion">{review.occasion}</p>
                            <Stars />
                        </div>

                        <div className="reviews-foot">
                            <span className="reviews-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M8 12.5l2.7 2.7L16 10" />
                                </svg>
                                Потвърдена поръчка
                            </span>
                            <Link to={`/products/${review.slug}`} className="reviews-product">
                                {review.product}
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            <div className="reviews-actions">
                {hasMore && (
                    <button type="button" className="reviews-more" onClick={() => setShowAll(true)}>
                        Покажи още отзиви
                    </button>
                )}
            </div>
        </section>
    );
}

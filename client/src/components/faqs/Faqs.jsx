import { useState } from "react";
import "./Faqs.css";

const faqItems = [
    {
        question: "Как мога да поръчам продукт?",
        answer: "Можете да направите поръчка чрез формата в сайта (в най-долната част на страницата) или чрез лично съобщение в нашите социални мрежи – Facebook, Instagram и TikTok."
    },
    {
        question: "Колко време отнема изработката?",
        answer: "Минималният срок за изработка е 7 работни дни, в зависимост от натовареността и спецификите на продукта."
    },
    {
        question: "Мога ли да поръчам персонализиран продукт?",
        answer: "Да, изработваме продукти по индивидуална поръчка според вашите предпочитания – цветове, размери и детайли."
    },
    {
        question: "Как се поддържат продуктите?",
        answer: "Препоръчваме да се съхраняват на сухо място, далеч от влага и директна слънчева светлина, за да запазят вида си по-дълго."
    },
    {
        question: "Как се извършва доставката?",
        answer: "Изпращаме поръчките с куриер до адрес или офис, като ще получите повече информация при потвърждение на поръчката."
    }
];

export default function Faqs() {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <>
            <section className="faq" id="faqs">
                <div className="faq-header">
                    <h2>Често задавани въпроси</h2>
                    <p>Всичко, което искаш да знаеш за нашите изделия.</p>
                </div>

                <div className="faq-accordion">
                    {faqItems.map((item, index) => (
                        <div
                            className={`faq-item ${activeIndex === index ? "active" : ""}`}
                            key={item.question}
                        >
                            <button
                                className="faq-question"
                                onClick={() =>
                                    setActiveIndex(activeIndex === index ? null : index)
                                }
                            >
                                {item.question}
                            </button>

                            <div className="faq-answer">
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
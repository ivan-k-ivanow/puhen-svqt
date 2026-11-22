import './HowItWorks.css';

const STEPS = [
    { title: 'Поръчвате онлайн', text: 'Изберете продукта, попълнете персонализацията и поръчайте.' },
    { title: 'Свързваме се с вас', text: 'По телефон, Viber или Messenger уточняваме всички детайли.' },
    { title: 'Визуализация', text: 'Изпращаме ви как ще изглежда и започваме след вашето одобрение.' },
    { title: 'Изработка', text: 'Изработваме поръчката ви ръчно до 7 работни дни.' },
    { title: 'Доставка', text: 'Изпращаме с Еконт. Плащате при получаване.' },
];

export default function HowItWorks() {
    return (
        <section className="how-it-works" aria-labelledby="how-it-works-title">
            <h2 id="how-it-works-title">Как протича поръчката</h2>

            <ol className="how-steps">
                {STEPS.map((step, index) => (
                    <li className="how-step" key={step.title}>
                        <span className="how-step-number" aria-hidden="true">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3>{step.title}</h3>
                        <p>{step.text}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}

import { Link, useLocation } from 'react-router';
import { formatOrderNumber } from '../../utils/orders';
import './OrderThankYou.css';

const CONTACT_TEXT = {
    CALL: 'Ще ви се обадим',
    VIBER: 'Ще ви пишем във Viber',
    MESSENGER: 'Ще ви пишем в Messenger',
};

export default function OrderThankYou() {
    const { state } = useLocation();
    const contact = CONTACT_TEXT[state?.contactMethod] ?? 'Ще се свържем с вас';

    return (
        <main className="ty-page">
            <span className="ty-icon" aria-hidden="true">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5 9-10" />
                </svg>
            </span>

            <h1 className="ty-title">Благодарим за поръчката!</h1>

            {state?.number && (
                <p className="ty-number">
                    Номер на заявката: <strong>{formatOrderNumber(state.number)}</strong>
                </p>
            )}

            <p className="ty-text">
                {contact}, за да потвърдим детайлите{state?.productName ? ` за ${state.productName}` : ''}.
                Започваме изработката след вашето одобрение.
            </p>

            <ul className="ty-facts">
                <li>Плащане с наложен платеж при получаване</li>
                <li>Изработка до 7 работни дни</li>
                <li>Доставка с Еконт</li>
            </ul>

            <div className="ty-actions">
                <Link to="/products" className="ty-btn">Към продуктите</Link>
                <a href="https://www.instagram.com/puhensvqt" target="_blank" rel="noopener noreferrer" className="ty-link">
                    Последвай ни в Instagram
                </a>
            </div>
        </main>
    );
}

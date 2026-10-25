
import { useState } from "react";
import "../../styles/cookie-consent.css";

const COOKIE_CONSENT_KEY = "puhen-svqt-cookie-consent";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(() => {
        return localStorage.getItem(COOKIE_CONSENT_KEY) === null;
    });

    function handleConsent(choice) {
        localStorage.setItem(COOKIE_CONSENT_KEY, choice);
        setIsVisible(false);
    }

    if (!isVisible) {
        return null;
    }

    return (
        <>
            <div id="cookie-backdrop" />

            <div
                id="cookie-banner"
                role="dialog"
                aria-label="Настройки за бисквитките"
                aria-describedby="cookie-description"
            >
                <div className="cookie-text">
                    <p id="cookie-description">
                        Ние използваме бисквитки. Може да ги поставим
                        за анализ на данните на посетителите ни, за да
                        подобрим нашия уебсайт, да покажем персонализирано
                        съдържание и да ви дадем страхотно изживяване
                        на уебсайта.
                    </p>

                    <a href="/privacy">
                        Научете повече
                    </a>
                </div>

                <div className="cookie-buttons">
                    <button
                        id="cookie-decline"
                        type="button"
                        onClick={() => handleConsent("declined")}
                    >
                        Откажи
                    </button>

                    <button
                        id="cookie-accept"
                        type="button"
                        onClick={() => handleConsent("accepted")}
                    >
                        Приемам
                    </button>
                </div>
            </div>
        </>
    );
}

import { useState } from "react";
import { Link } from "react-router";

export default function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);

    function closeHamburgerMenu() {
        setIsOpen(false);
    }
    return (

        <>
            <nav
                id="header-navigation"
                className={isOpen ? "active" : ""}
            >
                <ul className="navbar">
                    <li>
                        <Link to="/" onClick={closeHamburgerMenu}>
                            Начало
                        </Link>
                    </li>

                    <li>
                        <Link to="/products" onClick={closeHamburgerMenu}>
                            Продукти
                        </Link>
                    </li>

                    <li>
                        <a
                            className="btn-contact-us"
                            href="/#contact-us"
                            onClick={closeHamburgerMenu}
                        >
                            Свържи се с нас
                        </a>
                    </li>
                </ul>
            </nav>

            <button
                type="button"
                className="hamburger"
                aria-label={isOpen ? "Затвори менюто" : "Отвори менюто"}
                aria-expanded={isOpen}
                aria-controls="header-navigation"
                onClick={() => setIsOpen((previousState) => !previousState)}
            >
                <span />
                <span />
                <span />
            </button>
        </>
    );
}

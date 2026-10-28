import { useState } from "react";
import { Link } from "react-router";
import "./Navigation.css";

export default function Navigation() {
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
                            href="#contact-us"
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
                onClick={() => setIsOpen((previousState) => !previousState)}
            >
                <span />
                <span />
                <span />
            </button>
        </>
    );
}

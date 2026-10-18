import { Link } from "react-router";

export default function Header() {
    return (
        <>

            <header className="header">
                <div className="nav-wrapper">
                    <Link to="/" className="logo">
                        <img src="/images/logo.png" alt="Пухен Свят лого" />
                    </Link>

                    <div className="search-box">
                        <div className="search-input-wrapper">

                            <input type="text" id="search-input" placeholder="Търси продукт..." autoComplete="off" />
                            <button type="button" id="search-button" aria-label="Търси">
                                <img src="/images/search-icon.svg" alt="Търси" />
                            </button>
                        </div>

                        <div id="search-results" className="search-results hidden"></div>

                    </div>


                    <nav>
                        <ul className="navbar">
                            <li>
                                <Link to="/">Начало</Link>
                            </li>

                            <li>
                                <Link to="/">Продукти</Link>
                            </li>
                            
                            <li>
                                <a className="btn-contact-us" href="#contact-us">
                                    Свържи се с нас
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <button className="hamburger" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>
        </>
    );
}


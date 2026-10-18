import logo from "../../assets/logo.png"
import searchIcon from "../../assets/search-icon.svg";

export default function Header() {
    return (
        <>

            <header class="header">
                <div class="nav-wrapper">
                    <a href="/" class="logo">
                        <img src={logo} alt="Пухен Свят лого"/>
                    </a>

                    <div class="search-box">
                        <div class="search-input-wrapper">

                            <input type="text" id="search-input" placeholder="Търси продукт..." autocomplete="off"/>
                                <button type="button" id="search-button" aria-label="Търси">
                                    <img src={searchIcon} alt="Търси"/>
                                </button>
                        </div>

                        <div id="search-results" class="search-results hidden"></div>

                    </div>


                    <nav>
                        <ul class="navbar">
                            <li>
                                <a href="#home">Начало</a>
                            </li>
                            <li>
                                <a href="#products">Продукти</a>
                            </li>
                            <li>
                                <a href="#faqs">За нас</a>
                            </li>
                            <li>
                                <a class="btn-contact-us" href="#contact-us">
                                    Свържи се с нас
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <button class="hamburger" aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>
        </>
    );
}


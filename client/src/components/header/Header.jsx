import { Link } from "react-router";
import Navigation from "./navigation/Navigation";
import "./Header.css";


export default function Header() {
    return (
        <>

            <header className="header">
                <div className="nav-wrapper">
                    <Link to="/" className="logo">
                        <img src="/images/logo.png" alt="Пухен Свят лого" />
                    </Link>

                    {/* <div className="search-box">
                        <div className="search-input-wrapper">

                            <input type="text" id="search-input" placeholder="Търси продукт..." autoComplete="off" />
                            <button type="button" id="search-button" aria-label="Търси">
                                <img src="/images/search-icon.svg" alt="Търси" />
                            </button>
                        </div>

                        <div id="search-results" className="search-results hidden"></div>

                    </div> */}


                    <Navigation />
                </div>
            </header>
        </>
    );
}

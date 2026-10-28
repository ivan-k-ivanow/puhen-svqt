
import "./Footer.css";

export default function Footer() {
    return (
        <>
            <footer className="site-footer">
                <div className="footer-container">
                    {/* <!-- About --> */}
                    <div className="footer-about">
                        <a href="/" className="footer-logo">
                            <img src="/images/logo.png" alt="Пухен Свят лого"/>
                        </a>
                        <p>
                            Ръчно, с обич, за специални моменти.
                        </p>
                    </div>

                    {/* <!-- Contact --> */}
                    <div className="footer-contact" id="contact-us">
                        <h3>
                            Свържи се с нас
                        </h3>
                        <form id="contact-form" action="/contact" method="POST">
                            <input type="text" name="name" placeholder="Вашето име" required/>
                                <input type="email" name="email" placeholder="Вашият имейл" required/>
                                    <textarea name="message" placeholder="Вашето съобщение" rows="3" required></textarea>
                                    <button type="submit">
                                        Изпрати
                                    </button>
                                    <div id="toast-add" className="toast hidden"></div>
                                </form>
                            </div>

                            {/* <!-- Social --> */}
                            <div className="footer-social">
                                <h3>
                                    Последвайте ни:
                                </h3>
                                <div className="social-links">
                                    <a href="https://www.facebook.com/puhensvqt/" aria-label="Facebook" target="_blank"
                                        rel="noopener noreferrer">
                                        <img src="/images/facebook-logo.svg" alt="Facebook"/>
                                    </a>
                                    <a href="https://www.instagram.com/puhensvqt/" aria-label="Instagram" target="_blank"
                                        rel="noopener noreferrer">
                                        <img src="/images/instagram-logo.svg" alt="Instagram"/>
                                    </a>
                                    <a href="https://www.tiktok.com/@puhensvqt" aria-label="TikTok" target="_blank"
                                        rel="noopener noreferrer">
                                        <img src="/images/tik-tok-logo.png" alt="TikTok"/>
                                    </a>
                                </div>
                            </div>
                    </div>

                    {/* <!-- Footer bottom --> */}
                    <div className="footer-bottom">
                        <p>
                            &copy; 2026 Пухен Свят. Всички права запазени.
                        </p>
                        <a href="/privacy">
                            Политика за поверителност
                        </a>
                    </div>
            </footer>
        </>
    );
}
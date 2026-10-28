import "./Hero.css";

export default function Hero() {
    return (
        <>
            <section className="hero" id="hero">
                <div className="overlay"></div>
                {/*<h1 className="hero-headline">Пухен Свят</h1>*/}
                <p className="hero-subheadline">Персонализирани <br />подаръци, създадени<br />да се помнят.</p>
                <a href="#products" className="btn">Открий своя подарък</a>
            </section>
        </>
    );
}
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Faqs from "../../components/faqs/Faqs";
import Hero from "../../components/hero/Hero";
import Products from "../../components/catalog/Catalog";
import Reviews from "../../components/reviews/Reviews";
import HowItWorks from "../../components/how-it-works/HowItWorks";

export default function Home() {
    return (
        <>
            <Header />
            <Hero />
            <Products />
            <div className="home-how-it-works">
                <HowItWorks />
            </div>
            <Reviews />
            <Faqs />
            <Footer />

        </>
    );
}
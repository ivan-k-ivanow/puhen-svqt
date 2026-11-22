import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Faqs from "../../components/faqs/Faqs";
import Hero from "../../components/hero/Hero";
import Products from "../../components/catalog/Catalog";
import Reviews from "../../components/reviews/Reviews";

export default function Home() {
    return (
        <>
            <Header />
            <Hero />
            <Products />
            <Reviews />
            <Faqs />
            <Footer />

        </>
    );
}
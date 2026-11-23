import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Products from '../../components/catalog/Catalog';
import Faqs from '../../components/faqs/Faqs';
import Reviews from '../../components/reviews/Reviews';
import HowItWorks from '../../components/how-it-works/HowItWorks';

export default function Component() {
    return (
        <>

            <Header />
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
import Faqs from '../../components/faqs/Faqs';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import ProductDetails from '../../components/product-details/ProductDetails';
import Reviews from '../../components/reviews/Reviews';

export default function Product() {
    return (
        <>
            <Header />
            <ProductDetails />
            <Reviews />
            <Faqs />
            <Footer />
        </>
    );
}
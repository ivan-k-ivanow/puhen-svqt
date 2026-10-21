import Faqs from '../../components/faqs/Faqs';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import ProductDetails from '../../components/product-details/ProductDetails';
export default function Product() {
    return (
        <>
        <Header />
        <ProductDetails />
        <Faqs />
        <Footer/>
        </>
    );
}
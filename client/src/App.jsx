import { Routes, Route } from 'react-router'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import { useState } from 'react'
import Home from './pages/home/Home'
import ProductDetails from './components/product-details/ProductDetails'
import ProductPage from './pages/product-page/ProductPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />

     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/products" element={<ProductPage />} />
       <Route path="/products/:slug" element={<ProductDetails />} />
     </Routes>

     <Footer />
    </>
  )
}

export default App

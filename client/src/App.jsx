import { Routes, Route } from 'react-router'
import { useState } from 'react'
import Home from './pages/home/Home'
import Product from './pages/product/Product'
import ProductPage from './pages/product-catalog/ProductCatalog'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/products" element={<ProductPage />} />
       <Route path="/products/:slug" element={<Product />} />
     </Routes>

    </>
  )
}

export default App

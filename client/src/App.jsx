import { Routes, Route } from 'react-router'
import AdminLogin from './pages/admin/AdminLogin'
import { useState } from 'react'
import Home from './pages/home/Home'
import Product from './pages/product/Product'
import ProductPage from './pages/product-catalog/ProductCatalog'
import AdminProducts from './pages/admin/AdminProducts'

function App() {

  return (
    <>

     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/products" element={<ProductPage />} />
       <Route path="/products/:slug" element={<Product />} />

       <Route path="/admin/login" element={<AdminLogin />} />
       <Route path="/admin/products" element={<AdminProducts />} />
     </Routes>

    </>
  )
}

export default App

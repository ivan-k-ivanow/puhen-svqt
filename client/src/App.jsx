import { Routes, Route } from 'react-router'
import AdminLogin from './pages/admin/AdminLogin'
import AdminCreateProduct from './pages/admin/AdminCreateProduct'
import { useState } from 'react'
import Home from './pages/home/Home'
import Product from './pages/product/Product'
import ProductPage from './pages/product-catalog/ProductCatalog'
import AdminProducts from './pages/admin/AdminProducts'
import AdminEditProduct from './pages/admin/AdminEditProduct'

function App() {

  return (
    <>

     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/products" element={<ProductPage />} />
       <Route path="/products/:slug" element={<Product />} />

       <Route path="/admin/login" element={<AdminLogin />} />
       <Route path="/admin/products" element={<AdminProducts />} />
       <Route path="/admin/products/create" element={<AdminCreateProduct />} />
       <Route path="/admin/products/edit" element={<AdminEditProduct />} />
     </Routes>

    </>
  )
}

export default App

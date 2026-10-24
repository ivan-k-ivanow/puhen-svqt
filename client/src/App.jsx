import { Routes, Route } from 'react-router'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminCreateProduct from './pages/admin/AdminCreateProduct'
import Home from './pages/home/Home'
import Product from './pages/product/Product'
import ProductPage from './pages/product-catalog/ProductCatalog'
import AdminEditProduct from './pages/admin/AdminEditProduct'
import AuthProvider from './contexts/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:slug" element={<Product />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products/create" element={<AdminCreateProduct />} />
            <Route path="/admin/products/edit" element={<AdminEditProduct />} />
          </Route>
          
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App

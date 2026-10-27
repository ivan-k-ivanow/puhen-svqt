import { Routes, Route } from 'react-router'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminCreateProduct from './pages/admin/AdminCreateProduct'
import AdminCreateCategory from './pages/admin/AdminCreateCategory'
import Home from './pages/home/Home'
import Product from './pages/product/Product'
import ProductPage from './pages/product-catalog/ProductCatalog'
import AdminEditProduct from './pages/admin/AdminEditProduct'
import AuthProvider from './contexts/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CookieConsent from './components/cookie-consent/CookieConsent'
import ScrollToTop from './components/scroll-to-top/ScrollToTop'


function App() {

  return (
    <>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<><Home /> <CookieConsent /></>} />
          <Route path="/products" element={<><ProductPage /> <CookieConsent /></>} />
          <Route path="/products/:slug" element={<><Product /> <CookieConsent /></>} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products/create" element={<AdminCreateProduct />} />
            <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
            <Route path="/admin/categories/create" element={<AdminCreateCategory />} />
          </Route>

        </Routes>
      </AuthProvider>
    </>
  )
}

export default App

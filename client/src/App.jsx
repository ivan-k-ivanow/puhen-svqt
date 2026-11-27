import { Routes, Route, Navigate } from 'react-router'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminCreateProduct from './pages/admin/AdminCreateProduct'
import AdminCreateCategory from './pages/admin/AdminCreateCategory'
import Home from './pages/home/Home'
import Product from './pages/product/Product'
import ProductPage from './pages/product-catalog/ProductCatalog'
import AdminEditProduct from './pages/admin/AdminEditProduct'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCreateOrder from './pages/admin/AdminCreateOrder'
import AdminEditOrder from './pages/admin/AdminEditOrder'
import AdminOrder from './pages/admin/AdminOrder'
import AdminProduction from './pages/admin/AdminProduction'
import Order from './pages/order/Order'
import OrderThankYouPage from './pages/order/OrderThankYouPage'
import Privacy from './pages/privacy/Privacy'
import AuthProvider from './contexts/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CookieConsent from './components/cookie-consent/CookieConsent'
import ScrollToTop from './components/scroll-to-top/ScrollToTop'
import RouteTracker from './components/analytics/RouteTracker'
import AdminBar from './components/admin-bar/AdminBar'


function App() {

  return (
    <>
      <AuthProvider>
        <ScrollToTop />
        <RouteTracker />
        <AdminBar />
        <Routes>
          <Route path="/" element={<><Home /> <CookieConsent /></>} />
          <Route path="/products" element={<><ProductPage /> <CookieConsent /></>} />
          <Route path="/products/:slug" element={<><Product /> <CookieConsent /></>} />
          <Route path="/order" element={<><Order /> <CookieConsent /></>} />
          <Route path="/order/thank-you" element={<><OrderThankYouPage /> <CookieConsent /></>} />
          {/* Без банера за бисквитки – иначе той закрива страницата, към която води. */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products/create" element={<AdminCreateProduct />} />
            <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
            <Route path="/admin/categories/create" element={<AdminCreateCategory />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/create" element={<AdminCreateOrder />} />
            <Route path="/admin/orders/edit/:id" element={<AdminEditOrder />} />
            <Route path="/admin/orders/:id" element={<AdminOrder />} />
            <Route path="/admin/production" element={<AdminProduction />} />
          </Route>

        </Routes>
      </AuthProvider>
    </>
  )
}

export default App

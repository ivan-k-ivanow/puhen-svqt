import { Routes, Route } from 'react-router'
import { useState } from 'react'
import Home from './pages/home/Home'
import ProductDetails from './components/product-details/ProductDetails'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/product/:slug" element={<ProductDetails />} />
     </Routes>
    </>
  )
}

export default App

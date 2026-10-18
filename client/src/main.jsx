import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/resets.css';
import './styles/styles.css';
import './styles/product.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

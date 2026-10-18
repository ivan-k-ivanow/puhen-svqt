import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import './styles/resets.css';
import './styles/styles.css';
import './styles/product.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)

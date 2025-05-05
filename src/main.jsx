import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import GDPRConsent from './components/GDPRConsent/GDPRConsent.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/dist2/">
      <App />
      <GDPRConsent />
    </BrowserRouter>
  </StrictMode>,
)

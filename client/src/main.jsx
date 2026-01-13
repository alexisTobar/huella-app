import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. IMPORTAMOS EL PROVEEDOR DE GOOGLE
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. ENVOLVEMOS LA APP CON EL PROVIDER */}
    {/* Reemplaza el texto de abajo con tu ID de Cliente de Google Cloud */}
    <GoogleOAuthProvider clientId="535267678930-rufk56n1amq6lvtq84an3g5g80qamc5f.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
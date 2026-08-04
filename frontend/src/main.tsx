import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fuentes auto-hospedadas (pesos que se usan en el diseño)
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'

import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

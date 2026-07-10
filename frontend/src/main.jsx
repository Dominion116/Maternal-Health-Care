import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadAccessibility, applyAccessibility } from './utils/accessibility'

// Re-apply saved accessibility preferences (text size, contrast, motion)
// before the app renders so there is no flash of default styles.
applyAccessibility(loadAccessibility())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

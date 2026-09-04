import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AssistantYR from './AssistantYR.jsx'
import './styles.css'
import './mobile-fixes.css'
import './assistant.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <AssistantYR />
  </React.StrictMode>,
)

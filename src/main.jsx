import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Enhancements from './Enhancements.jsx'
import './styles.css'
import './enhancements.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Enhancements />
  </React.StrictMode>,
)

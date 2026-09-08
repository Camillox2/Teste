import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import PageRouter from './PageRouter.jsx'
import './styles.css'
import './assistant.css'
import './experience-fixes.css'
import './refinements.css'
import './editorial.css'

const root = document.getElementById('root')
const page = <React.StrictMode><PageRouter path={window.location.pathname} /></React.StrictMode>
if (root.hasChildNodes()) hydrateRoot(root, page)
else createRoot(root).render(page)

import { renderToString } from 'react-dom/server'
import PageRouter from './PageRouter.jsx'
export const renderPage = path => renderToString(<PageRouter path={path} />)

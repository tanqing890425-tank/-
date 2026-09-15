import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WorkApp from './WorkApp'
import './styles/global.css'
import './styles/portfolio.css'
import './styles/work.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorkApp />
  </StrictMode>,
)

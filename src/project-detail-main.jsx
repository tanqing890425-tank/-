import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProjectDetailApp from './ProjectDetailApp'
import './styles/global.css'
import './styles/portfolio.css'
import './styles/project-detail.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><ProjectDetailApp /></StrictMode>,
)

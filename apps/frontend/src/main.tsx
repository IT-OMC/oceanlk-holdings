import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// react-big-calendar's own stylesheet must load BEFORE index.css, which
// now carries the dark-theme overrides for it (moved out of
// pages/admin/EventsManagement.css).
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './index.css'
import './i18n/config'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

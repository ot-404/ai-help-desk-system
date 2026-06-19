import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register the service worker for PWA / offline support (production web only).
// Skipped inside the native Capacitor app, where assets are already bundled.
// Auto-updates: when a new version is deployed, activate it and reload once so
// users never get stranded on a stale build.
const isNativeApp = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()
if (import.meta.env.PROD && !isNativeApp && 'serviceWorker' in navigator) {
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return
    reloading = true
    window.location.reload()
  })

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')

      // Tell an already-waiting worker to take over (only when a controller
      // already exists — i.e. this is an update, not the very first install).
      if (reg.waiting && navigator.serviceWorker.controller) {
        reg.waiting.postMessage('SKIP_WAITING')
      }

      reg.addEventListener('updatefound', () => {
        const next = reg.installing
        if (!next) return
        next.addEventListener('statechange', () => {
          if (next.state === 'installed' && navigator.serviceWorker.controller) {
            next.postMessage('SKIP_WAITING')
          }
        })
      })

      // Proactively check for a new version each time the app is opened.
      reg.update().catch(() => {})
    } catch {
      /* ignore */
    }
  })
}

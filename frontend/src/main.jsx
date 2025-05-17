import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Toaster for toast notifications */}
    <Toaster
      toastOptions={{
        style: {
          minWidth: '200',
          maxWidth: '400px',
          width: 'fit-content',
          wordBreak: 'break-word',
          fontSize: '16px',
          padding: '10px 15px',
          textTransform: 'capitalize'
        },
      }}
      visibleToasts={2}
    />

    <AuthProvider>
        <App />
    </AuthProvider>
  </StrictMode>,
)

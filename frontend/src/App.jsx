import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from '@/routes'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1a1a2e',
            border: '1px solid #f3d9d7',
            borderRadius: '1rem',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 14px 0 rgb(0 0 0 / 0.08)',
            maxWidth: '380px',
          },
          success: {
            iconTheme: { primary: '#059669', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
    </>
  )
}

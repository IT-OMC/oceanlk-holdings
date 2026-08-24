'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Uncaught error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg m-4">
          <p className="font-bold">Something went wrong.</p>
          <p className="text-sm">Please refresh the page or try again later.</p>
          <button onClick={reset} className="mt-3 px-4 py-2 rounded bg-red-500 text-white">
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

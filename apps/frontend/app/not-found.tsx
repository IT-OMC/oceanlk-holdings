import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-ocean-base text-center px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-lg text-gray-600">This page could not be found.</p>
      <Link href="/" className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark transition-colors">
        Back to home
      </Link>
    </div>
  )
}

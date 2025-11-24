import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5]">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/dashboard">
          <Button size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}


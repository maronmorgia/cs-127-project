'use client'

import { useRouter } from 'next/navigation'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div>
      <p>Sorry, something went wrong</p>
      <button onClick={() => router.push('/admin/login')}>Go to Login</button>
    </div>
  )
}

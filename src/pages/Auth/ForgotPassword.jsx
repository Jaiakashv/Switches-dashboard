import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Network } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock functionality
    setTimeout(() => {
      setMessage('If an account exists for this email, you will receive password reset instructions.')
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="w-full max-w-md bg-[var(--surface)] p-8 rounded-2xl shadow-xl border border-[var(--border)]">
      <div className="flex flex-col items-center mb-8">
        <Network className="w-12 h-12 text-blue-500 mb-2" />
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1 text-center">
          Enter your email and we'll send you instructions to reset your password.
        </p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--page-bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isSubmitting || message !== ''}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || message !== ''}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link to="/login" className="text-[var(--text-muted)] hover:text-blue-500 transition-colors">
          &larr; Back to Login
        </Link>
      </div>
    </div>
  )
}

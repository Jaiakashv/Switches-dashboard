import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { changePassword } from '../../api/authApi'

export default function Profile() {
  const { user } = useAuth()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [error, setError] = useState('')

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match')
      return
    }

    try {
      await changePassword(passwords.current, passwords.new)
      alert('Password updated successfully')
      setIsChangingPassword(false)
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (err) {
      setError(err.message || 'Failed to update password')
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">Manage your personal information</p>
      </div>

      <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-semibold">{user.name}</h3>
            <p className="text-[var(--text-muted)]">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          {!isChangingPassword ? (
            <button 
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors font-medium text-sm"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
              <h4 className="font-semibold text-lg mb-4">Change Password</h4>
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({...prev, current: e.target.value}))}
                  className="w-full px-4 py-2 bg-[var(--page-bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input 
                  type="password" 
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({...prev, new: e.target.value}))}
                  className="w-full px-4 py-2 bg-[var(--page-bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({...prev, confirm: e.target.value}))}
                  className="w-full px-4 py-2 bg-[var(--page-bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                  Update Password
                </button>
                <button 
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

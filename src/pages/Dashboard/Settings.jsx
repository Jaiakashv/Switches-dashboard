import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [emailPrefs, setEmailPrefs] = useState({
    marketing: false,
    securityAlerts: true,
    weeklyReports: false
  })

  const [notificationPrefs, setNotificationPrefs] = useState({
    push: true,
    sms: false
  })

  const handleSave = () => {
    // In a real application, you would save this to the backend API or localStorage
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">Manage your application preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Theme Settings */}
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-[var(--text-muted)]">Toggle application color scheme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300'} relative`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notificationPrefs.push}
                onChange={(e) => setNotificationPrefs(prev => ({...prev, push: e.target.checked}))}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-[var(--text-muted)]">Receive alerts in browser</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notificationPrefs.sms}
                onChange={(e) => setNotificationPrefs(prev => ({...prev, sms: e.target.checked}))}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-[var(--text-muted)]">Receive critical alerts via SMS</p>
              </div>
            </label>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Email Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={emailPrefs.securityAlerts}
                onChange={(e) => setEmailPrefs(prev => ({...prev, securityAlerts: e.target.checked}))}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <div>
                <p className="font-medium">Security & Cluster Alerts</p>
                <p className="text-sm text-[var(--text-muted)]">Crucial updates about cluster health and security</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={emailPrefs.weeklyReports}
                onChange={(e) => setEmailPrefs(prev => ({...prev, weeklyReports: e.target.checked}))}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-[var(--text-muted)]">Summary of cluster performance over the week</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={emailPrefs.marketing}
                onChange={(e) => setEmailPrefs(prev => ({...prev, marketing: e.target.checked}))}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <div>
                <p className="font-medium">Marketing & News</p>
                <p className="text-sm text-[var(--text-muted)]">Product updates and promotional offers</p>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Save Preferences
        </button>
      </div>
    </div>
  )
}

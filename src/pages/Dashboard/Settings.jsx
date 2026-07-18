import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const defaultEmailPrefs = {
  marketing: false,
  securityAlerts: true,
  weeklyReports: false
}

const defaultNotificationPrefs = {
  push: true,
  sms: false
}

const loadStoredPrefs = () => {
  if (typeof window === 'undefined') {
    return {
      emailPrefs: defaultEmailPrefs,
      notificationPrefs: defaultNotificationPrefs
    }
  }

  try {
    const storedPrefs = JSON.parse(localStorage.getItem('userPreferences') || '{}')

    return {
      emailPrefs: { ...defaultEmailPrefs, ...storedPrefs.emailPrefs },
      notificationPrefs: { ...defaultNotificationPrefs, ...storedPrefs.notificationPrefs }
    }
  } catch {
    return {
      emailPrefs: defaultEmailPrefs,
      notificationPrefs: defaultNotificationPrefs
    }
  }
}

export default function Settings() {
  const initialPrefs = loadStoredPrefs()
  const [emailPrefs, setEmailPrefs] = useState(initialPrefs.emailPrefs)
  const [notificationPrefs, setNotificationPrefs] = useState(initialPrefs.notificationPrefs)
  const isInitialRender = useRef(true)

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreferences', JSON.stringify({
        emailPrefs,
        notificationPrefs
      }))
    }

    toast.success('Saved your preference')
  }, [emailPrefs, notificationPrefs])

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">Manage your application preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
        <p className="text-sm text-[var(--text-muted)]">Changes are saved automatically.</p>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell, Lock, Palette, Save, UserCog } from 'lucide-react'

function Settings() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rehan_settings')) || {
        emailNotifications: true,
        orderNotifications: true,
        theme: 'classic',
        language: 'english'
      }
    } catch {
      return { emailNotifications: true, orderNotifications: true, theme: 'classic', language: 'english' }
    }
  })

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setSaved(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('rehan_settings', JSON.stringify(settings))
    setSaved(true)
  }

  return (
    <section className="dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1>Settings</h1>
          <p>Account preferences, notifications aur basic security settings manage karo.</p>
        </div>

        <form onSubmit={handleSubmit} className="settings-grid">
          <div className="card settings-card">
            <h3><Bell size={22} /> Notifications</h3>
            <label className="switch-row">
              <span>Email notifications</span>
              <input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} />
            </label>
            <label className="switch-row">
              <span>Order status notifications</span>
              <input type="checkbox" name="orderNotifications" checked={settings.orderNotifications} onChange={handleChange} />
            </label>
          </div>

          <div className="card settings-card">
            <h3><Palette size={22} /> Appearance</h3>
            <div className="form-group">
              <label className="form-label">Theme</label>
              <select className="form-select" name="theme" value={settings.theme} onChange={handleChange}>
                <option value="classic">Classic Bakery</option>
                <option value="cream">Cream Light</option>
                <option value="chocolate">Chocolate Dark</option>
              </select>
            </div>
          </div>

          <div className="card settings-card">
            <h3><UserCog size={22} /> Preference</h3>
            <div className="form-group">
              <label className="form-label">Language</label>
              <select className="form-select" name="language" value={settings.language} onChange={handleChange}>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>
          </div>

          <div className="card settings-card">
            <h3><Lock size={22} /> Security</h3>
            <p>Password change ke liye login page ka Forgot Password option use karo.</p>
          </div>

          <div className="settings-actions">
            {saved && <div className="alert alert-success">Settings saved successfully!</div>}
            <button className="btn btn-primary"><Save size={18} /> Save Settings</button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Settings

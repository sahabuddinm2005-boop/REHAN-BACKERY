import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, KeyRound, ArrowLeft } from 'lucide-react'
import { forgotPassword } from '../api/api'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [resetLink, setResetLink] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setResetLink('')

    if (!email.trim()) {
      setError('Email address required hai')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Valid email address enter karo')
      return
    }

    setLoading(true)
    try {
      const response = await forgotPassword(email)
      if (response.success) {
        setMessage(response.message || 'Password reset link generated successfully')
        setResetLink(response.data?.reset_link || response.reset_link || '')
      } else {
        setError(response.message || 'Reset request failed')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <KeyRound size={42} className="auth-icon" />
            <h1>Forgot Password</h1>
            <p>Apna registered email enter karo. Reset link local/demo mode me yahin show hoga.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                />
              </div>
            </div>

            <button className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Generate Reset Link'}
            </button>
          </form>

          {resetLink && (
            <div className="demo-credentials">
              <h4>Demo Reset Link</h4>
              <p className="break-text">{resetLink}</p>
            </div>
          )}

          <div className="auth-footer">
            <Link to="/login"><ArrowLeft size={16} /> Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Phone, MapPin, User, Save, ShieldCheck, Truck, FileText, Send, ChevronDown, ChevronUp, CreditCard, Sparkles } from 'lucide-react'

function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateUser } = useAuth()
  const [saved, setSaved] = useState(false)
  const [deliverySaved, setDeliverySaved] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', role: '' })
  const [deliveryForm, setDeliveryForm] = useState({
    vehicleType: '',
    vehicleNumber: '',
    drivingLicense: '',
    panCard: '',
    aadhaarCard: '',
    deliveryArea: '',
    experience: '',
    note: ''
  })
  const [deliveryRequest, setDeliveryRequest] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const userEmail = user?.email || ''
    const savedRequest = localStorage.getItem(`delivery_request_${userEmail}`)

    setFormData({
      name: user?.name || user?.full_name || '',
      email: userEmail,
      phone: user?.phone || '',
      address: user?.address || '',
      role: user?.role || 'customer'
    })

    if (savedRequest) {
      setDeliveryRequest(JSON.parse(savedRequest))
      setShowDeliveryForm(false)
    } else {
      setDeliveryRequest(null)
    }
  }, [isAuthenticated, navigate, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target
    let nextValue = value

    if (name === 'panCard') nextValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    if (name === 'aadhaarCard') nextValue = value.replace(/\D/g, '').slice(0, 12)

    setDeliveryForm(prev => ({ ...prev, [name]: nextValue }))
    setDeliverySaved(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Name and email are permanent account identity fields, so they are not editable here.
    updateUser?.({
      ...user,
      phone: formData.phone,
      address: formData.address,
      role: formData.role
    })
    setSaved(true)
  }

  const handleDeliverySubmit = (e) => {
    e.preventDefault()

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    if (!panRegex.test(deliveryForm.panCard)) {
      alert('Please enter valid PAN number. Example: ABCDE1234F')
      return
    }

    if (deliveryForm.aadhaarCard.length !== 12) {
      alert('Please enter valid 12 digit Aadhaar number.')
      return
    }

    const requestData = {
      id: Date.now(),
      userEmail: formData.email,
      userName: formData.name,
      phone: formData.phone,
      address: formData.address,
      ...deliveryForm,
      status: 'Pending Admin Approval',
      appliedAt: new Date().toLocaleString()
    }

    localStorage.setItem(`delivery_request_${formData.email}`, JSON.stringify(requestData))
    setDeliveryRequest(requestData)
    setDeliverySaved(true)
    setShowDeliveryForm(false)
  }

  return (
    <section className="dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Name aur email account identity ke liye locked hain. Phone/address update kar sakte ho.</p>
        </div>

        <div className="profile-grid">
          <div className="card profile-summary-card">
            <div className="profile-avatar"><User size={54} /></div>
            <h2>{formData.name || 'Bakery User'}</h2>
            <p>{formData.email}</p>
            <span className="badge badge-primary"><ShieldCheck size={14} /> {formData.role}</span>
            <div className="profile-links">
              <Link to="/settings" className="btn btn-secondary w-full">Account Settings</Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card profile-form-card">
            {saved && <div className="alert alert-success">Profile saved successfully!</div>}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={20} className="input-icon" />
                <input className="form-input readonly-input" name="name" value={formData.name} readOnly disabled />
              </div>
              <small className="form-help">Name change nahi hoga.</small>
            </div>

            <div className="form-group">
              <label className="form-label">Email / Gmail</label>
              <div className="input-with-icon">
                <Mail size={20} className="input-icon" />
                <input className="form-input readonly-input" name="email" value={formData.email} readOnly disabled />
              </div>
              <small className="form-help">Gmail change nahi hoga.</small>
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <div className="input-with-icon">
                <Phone size={20} className="input-icon" />
                <input className="form-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile number" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <div className="input-with-icon textarea-icon-wrap">
                <MapPin size={20} className="input-icon textarea-icon" />
                <textarea className="form-textarea" name="address" value={formData.address} onChange={handleChange} placeholder="Delivery address" />
              </div>
            </div>

            <button className="btn btn-primary"><Save size={18} /> Save Profile</button>
          </form>
        </div>

        {formData.role !== 'delivery' && (
          <div className="card delivery-request-card attractive-delivery-card">
            <div className="delivery-hero-box">
              <div className="delivery-hero-icon"><Truck size={34} /></div>
              <div className="delivery-hero-content">
                <span className="delivery-tag"><Sparkles size={14} /> New Opportunity</span>
                <h2>Become a Delivery Partner</h2>
                <p>Rehan Bakery ke delivery partner banne ke liye profile se request bhejo. Admin approval ke baad delivery panel access milega.</p>
              </div>
              {deliveryRequest && <span className="badge badge-warning delivery-status-badge">{deliveryRequest.status}</span>}
            </div>

            {deliverySaved && <div className="alert alert-success">Delivery request submit ho gayi. Admin approval ke baad role delivery hoga.</div>}

            {deliveryRequest ? (
              <div className="delivery-status-box premium-status-box">
                <FileText size={40} />
                <div>
                  <h3>Delivery Request Submitted</h3>
                  <p><strong>Applied:</strong> {deliveryRequest.appliedAt}</p>
                  <p><strong>Vehicle:</strong> {deliveryRequest.vehicleType || 'Not given'} {deliveryRequest.vehicleNumber ? `(${deliveryRequest.vehicleNumber})` : ''}</p>
                  <p><strong>PAN:</strong> {deliveryRequest.panCard || 'Not given'}</p>
                  <p><strong>Aadhaar:</strong> {deliveryRequest.aadhaarCard ? `XXXX-XXXX-${deliveryRequest.aadhaarCard.slice(-4)}` : 'Not given'}</p>
                  <p><strong>Area:</strong> {deliveryRequest.deliveryArea || 'Not given'}</p>
                  <p className="text-muted">Admin dashboard se approve karne ke baad user delivery panel access kar payega.</p>
                </div>
              </div>
            ) : (
              <>
                <button type="button" className="btn btn-primary delivery-open-btn" onClick={() => setShowDeliveryForm(prev => !prev)}>
                  <Truck size={18} />
                  {showDeliveryForm ? 'Hide Delivery Form' : 'Open Delivery Form'}
                  {showDeliveryForm ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {showDeliveryForm && (
                  <form onSubmit={handleDeliverySubmit} className="delivery-form-grid attractive-delivery-form">
                    <div className="form-group">
                      <label className="form-label">Vehicle Type *</label>
                      <select className="form-select" name="vehicleType" value={deliveryForm.vehicleType} onChange={handleDeliveryChange} required>
                        <option value="">Select vehicle</option>
                        <option value="Bike">Bike</option>
                        <option value="Scooter">Scooter</option>
                        <option value="Cycle">Cycle</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Vehicle Number</label>
                      <input className="form-input" name="vehicleNumber" value={deliveryForm.vehicleNumber} onChange={handleDeliveryChange} placeholder="MP04 AB 1234" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Driving License Number</label>
                      <input className="form-input" name="drivingLicense" value={deliveryForm.drivingLicense} onChange={handleDeliveryChange} placeholder="License number" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred Delivery Area *</label>
                      <input className="form-input" name="deliveryArea" value={deliveryForm.deliveryArea} onChange={handleDeliveryChange} placeholder="Example: Bhopal, MP Nagar" required />
                    </div>

                    <div className="form-group">
                      <label className="form-label">PAN Card Number *</label>
                      <div className="input-with-icon">
                        <CreditCard size={20} className="input-icon" />
                        <input className="form-input" name="panCard" value={deliveryForm.panCard} onChange={handleDeliveryChange} placeholder="ABCDE1234F" required />
                      </div>
                      <small className="form-help">Format: ABCDE1234F</small>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Aadhaar Card Number *</label>
                      <div className="input-with-icon">
                        <FileText size={20} className="input-icon" />
                        <input className="form-input" name="aadhaarCard" value={deliveryForm.aadhaarCard} onChange={handleDeliveryChange} placeholder="12 digit Aadhaar number" required />
                      </div>
                      <small className="form-help">Only 12 digits allowed. Profile me last 4 digits show honge.</small>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Experience</label>
                      <input className="form-input" name="experience" value={deliveryForm.experience} onChange={handleDeliveryChange} placeholder="Example: 1 year" />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Why do you want to join delivery?</label>
                      <textarea className="form-textarea" name="note" value={deliveryForm.note} onChange={handleDeliveryChange} placeholder="Short message for admin" />
                    </div>

                    <button className="btn btn-primary full-width submit-delivery-btn"><Send size={18} /> Submit Delivery Request</button>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        .readonly-input:disabled {
          background: #f5efe7;
          color: var(--color-text);
          cursor: not-allowed;
          opacity: 1;
        }
        .delivery-request-card {
          margin-top: 2rem;
        }
        .attractive-delivery-card {
          overflow: hidden;
          border: 1px solid #ead8c2;
          background: linear-gradient(135deg, #fffaf2 0%, #fff2dd 52%, #fff 100%);
          box-shadow: 0 18px 45px rgba(139, 69, 19, 0.13);
          position: relative;
        }
        .attractive-delivery-card::before {
          content: '';
          position: absolute;
          right: -70px;
          top: -70px;
          width: 190px;
          height: 190px;
          border-radius: 999px;
          background: rgba(255, 140, 0, 0.15);
        }
        .delivery-hero-box {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1.15rem;
          margin-bottom: 1.35rem;
        }
        .delivery-hero-icon {
          width: 74px;
          height: 74px;
          border-radius: 22px;
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(135deg, var(--color-primary), var(--color-highlight));
          box-shadow: 0 10px 24px rgba(139, 69, 19, 0.25);
          flex-shrink: 0;
        }
        .delivery-hero-content h2 {
          margin: 0.2rem 0 0.35rem;
          font-size: 1.75rem;
        }
        .delivery-hero-content p {
          margin: 0;
          color: var(--color-text-light);
          max-width: 760px;
        }
        .delivery-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          color: #7a3b00;
          background: #ffe8bf;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .delivery-status-badge {
          margin-left: auto;
          white-space: nowrap;
        }
        .delivery-open-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.9rem 1.25rem;
          justify-content: center;
          font-weight: 800;
          box-shadow: 0 10px 18px rgba(139, 69, 19, 0.18);
        }
        .delivery-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }
        .attractive-delivery-form {
          margin-top: 1.25rem;
          padding: 1.25rem;
          border: 1px solid #ecd2b4;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(6px);
          animation: deliveryFormOpen 0.25s ease-out;
        }
        .attractive-delivery-form .form-group {
          padding: 0.85rem;
          border-radius: 14px;
          background: #fffdf9;
          border: 1px solid #f0e0cf;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .submit-delivery-btn {
          padding: 0.95rem 1.25rem;
          font-weight: 800;
        }
        .delivery-status-box {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          padding: 1.25rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: #fff8ef;
        }
        .premium-status-box {
          border-radius: 18px;
          background: #fffdf8;
          box-shadow: inset 0 0 0 1px #f0dcc7;
        }
        .delivery-status-box svg {
          color: var(--color-primary);
          flex-shrink: 0;
        }
        .delivery-status-box h3 {
          margin-bottom: 0.5rem;
        }
        .delivery-status-box p {
          margin: 0.25rem 0;
        }
        .text-muted {
          color: var(--color-text-light);
        }
        .badge-warning {
          background: #fff1c7;
          color: #8a5a00;
        }
        @keyframes deliveryFormOpen {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .delivery-hero-box {
            flex-direction: column;
            text-align: center;
            align-items: stretch;
          }
          .delivery-hero-icon {
            margin: 0 auto;
          }
          .delivery-status-badge {
            margin-left: 0;
            align-self: center;
          }
          .delivery-form-grid {
            grid-template-columns: 1fr;
          }
          .delivery-status-box {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  )
}

export default Profile

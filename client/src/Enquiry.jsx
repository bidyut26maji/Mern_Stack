import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/web/api'

export default function Enquiry() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: ''
  })
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [serverStatus, setServerStatus] = useState('checking') // 'checking', 'online', 'offline'

  // Fetch all enquiries on component mount and after submission
  const fetchEnquiries = async () => {
    try {
      setLoading(true)
      setError('') // Clear previous errors
      const response = await axios.get(`${API_BASE_URL}/enquiry-list`)
      if (response.data.status === 1) {
        setEnquiries(response.data.data || [])
      } else {
        setError(response.data.message || 'Failed to fetch enquiries')
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch enquiries. Make sure the server is running on port 8000.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Check server status on mount
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/health')
        if (response.data.status === 'ok') {
          setServerStatus('online')
          // Fetch enquiries after confirming server is online
          try {
            setLoading(true)
            setError('')
            const enquiryResponse = await axios.get(`${API_BASE_URL}/enquiry-list`)
            if (enquiryResponse.data.status === 1) {
              setEnquiries(enquiryResponse.data.data || [])
            }
          } catch (err) {
            console.error('Error fetching enquiries:', err)
            setError('Failed to fetch enquiries')
          } finally {
            setLoading(false)
          }
        }
      } catch (err) {
        console.error('Server is offline:', err)
        setServerStatus('offline')
        setError('Cannot connect to server. Make sure the backend is running on port 8000.')
      }
    }
    checkServerStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear messages when user types
    setError('')
    setSuccess('')
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic validation
    if (!formData.name || !formData.mobile || !formData.email || !formData.message) {
      setError('Please fill in all fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(`${API_BASE_URL}/enquiry-insert`, {
        sName: formData.name,
        sEmail: formData.email,
        sPhone: formData.mobile,
        sMessage: formData.message
      })

      if (response.data.status === 1) {
        setSuccess('Enquiry submitted successfully!')
        // Reset form
        setFormData({
          name: '',
          mobile: '',
          email: '',
          message: ''
        })
        // Refresh the enquiry list
        await fetchEnquiries()
      } else {
        setError(response.data.message || 'Failed to submit enquiry')
      }
    } catch (err) {
      console.error('Error submitting enquiry:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit enquiry. Make sure the server is running on port 8000.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle delete enquiry
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) {
      return
    }

    try {
      setError('') // Clear previous errors
      const response = await axios.delete(`${API_BASE_URL}/enquiry-delete/${id}`)
      if (response.data.status === 1) {
        setSuccess('Enquiry deleted successfully!')
        await fetchEnquiries()
      } else {
        setError(response.data.message || 'Failed to delete enquiry')
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete enquiry. Make sure the server is running.'
      setError(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">User Enquiry System</h1>
        
        {/* Server Status Indicator */}
        <div className="mb-4 text-center">
          {serverStatus === 'checking' && (
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
              Checking server connection...
            </div>
          )}
          {serverStatus === 'online' && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Server connected
            </div>
          )}
          {serverStatus === 'offline' && (
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Server offline - Please start the backend server
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Form */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Submit Your Enquiry</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Enter your message"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>

          {/* Right Side - Data Display */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Enquiry List</h2>
              <button
                onClick={fetchEnquiries}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition text-sm"
              >
                Refresh
              </button>
            </div>

            {loading && enquiries.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No enquiries found. Submit your first enquiry!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {enquiries.map((enquiry) => (
                  <div
                    key={enquiry._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">{enquiry.name}</h3>
                      <button
                        onClick={() => handleDelete(enquiry._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Email:</span> {enquiry.email}
                      </p>
                      <p>
                        <span className="font-medium">Mobile:</span> {enquiry.phone}
                      </p>
                      <p>
                        <span className="font-medium">Message:</span> {enquiry.message}
                      </p>
                      {enquiry.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Submitted: {new Date(enquiry.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

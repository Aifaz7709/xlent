import React, { useState, useEffect } from 'react'

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  // Fetch customers from your backend API
  const fetchCustomers = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://xlent-production.up.railway.app'
      
      const response = await fetch(`${baseUrl}/api/customers`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch customers')
      }

      setCustomers(data.customers  || [])
      setMessage({ type: '', text: '' })
      
    } catch (error) {
      console.error('Error fetching customers:', error)
      setMessage({ 
        type: 'error', 
        text: 'Failed to load customers. Please try again.' 
      })
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    customer.email?.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone_number?.toLowerCase().includes(search.toLowerCase())
  )

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Count stats
  const totalCustomers = customers.length
  const today = new Date().toDateString()
  const todayCustomers = customers.filter(c => 
    new Date(c.created_at).toDateString() === today
  ).length

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Customer Dashboard</h1>
        <div className="header-actions">
          <button onClick={fetchCustomers} className="refresh-btn">
            🔄 Refresh
          </button>
          <span className="customer-count">
            {totalCustomers} customers total
          </span>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{todayCustomers}</h3>
            <p>Today</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <h3>{customers.filter(c => c.phone_number).length}</h3>
            <p>With Phone</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>{customers.filter(c => c.email).length}</h3>
            <p>With Email</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="search-icon">🔍</div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading customers...</p>
        </div>
      ) : (
        /* Customer Table */
        <div className="customer-table-container">
          {filteredCustomers.length === 0 ? (
            <div className="empty-state">
              {search ? (
                <p>No customers match your search</p>
              ) : (
                <p>No customers found yet</p>
              )}
            </div>
          ) : (
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id || customer.created_at}>
                    <td>
                      <div className="customer-name">
                        <span className="avatar">
                          {customer.customer_name?.charAt(0) || 'C'}
                        </span>
                        {customer.customer_name || 'No name'}
                      </div>
                    </td>
                    <td>
                      <a 
                        href={`tel:${customer.phone_number}`}
                        className="phone-link"
                      >
                        {customer.phone_number || 'No phone'}
                      </a>
                    </td>
                    <td>
                      <a 
                        href={`mailto:${customer.email}`}
                        className="email-link"
                      >
                        {customer.email || 'No email'}
                      </a>
                    </td>
                    <td className="date-cell">
                      {formatDate(customer.created_at)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => window.open(`tel:${customer.phone_number}`, '_blank')}
                          className="action-btn call-btn"
                          disabled={!customer.phone_number}
                        >
                          📞
                        </button>
                        <button 
                          onClick={() => window.open(`mailto:${customer.email}`, '_blank')}
                          className="action-btn email-btn"
                          disabled={!customer.email}
                        >
                          ✉️
                        </button>
                        <button 
                          onClick={() => {
                            const phone = customer.phone_number?.replace(/\D/g, '')
                            window.open(`https://wa.me/91${phone}`, '_blank')
                          }}
                          className="action-btn whatsapp-btn"
                          disabled={!customer.phone_number}
                        >
                          💬
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .dashboard-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
        }

        .dashboard-header h1 {
          color: #1f2937;
          margin: 0;
          font-size: 24px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .refresh-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .refresh-btn:hover {
          background: #2563eb;
        }

        .customer-count {
          color: #6b7280;
          font-size: 14px;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .alert-success {
          background-color: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .alert-error {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 15px;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content h3 {
          margin: 0;
          font-size: 28px;
          color: #1f2937;
        }

        .stat-content p {
          margin: 5px 0 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .search-container {
          position: relative;
          margin-bottom: 20px;
          max-width: 500px;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px 12px 45px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .loading-container {
          text-align: center;
          padding: 60px 0;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .customer-table-container {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 15px rgba(0,0,0,0.1);
        }

        .customer-table {
          width: 100%;
          border-collapse: collapse;
        }

        .customer-table th {
          background: #f8fafc;
          padding: 15px;
          text-align: left;
          color: #4b5563;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
        }

        .customer-table td {
          padding: 15px;
          border-bottom: 1px solid #f3f4f6;
        }

        .customer-table tr:hover {
          background: #f9fafb;
        }

        .customer-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .phone-link, .email-link {
          color: #3b82f6;
          text-decoration: none;
        }

        .phone-link:hover, .email-link:hover {
          text-decoration: underline;
        }

        .date-cell {
          color: #6b7280;
          font-size: 14px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .call-btn {
          background: #dcfce7;
          color: #16a34a;
        }

        .call-btn:hover {
          background: #bbf7d0;
        }

        .email-btn {
          background: #dbeafe;
          color: #3b82f6;
        }

        .email-btn:hover {
          background: #bfdbfe;
        }

        .whatsapp-btn {
          background: #f0f9ff;
          color: #0ea5e9;
        }

        .whatsapp-btn:hover {
          background: #e0f2fe;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .header-actions {
            width: 100%;
            justify-content: space-between;
          }
          
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .customer-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  )
}

export default CustomerDashboard
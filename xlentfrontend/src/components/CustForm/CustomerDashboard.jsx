import React, { useState, useEffect } from 'react'

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      console.log('🔄 Starting fetch...')
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://xlent-production.up.railway.app'
      
    // ✅ Keep the timestamp to prevent caching
     const timestamp = new Date().getTime()
    const url = `${baseUrl}/api/customer_inquiries?_=${timestamp}`
      
      console.log('📡 Fetching from:', url)
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store' // Prevent caching
      })
  
      console.log('✅ Response status:', response.status, response.statusText)
      
      // Log response headers
      const headers = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })
      console.log('📋 Response headers:', headers)
  
      const data = await response.json()
      console.log('📦 Response data:', data)
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to fetch customers`)
      }
  
      console.log('👥 Customers count from API:', data.count)
      console.log('👥 Customers array:', data.customers)
      
      if (data.customers && data.customers.length > 0) {
        console.log('🎯 First customer:', data.customers[0])
      }
  
      setCustomers(data.customers || [])
      
      if (data.customers && data.customers.length === 0) {
        setMessage({ 
          type: 'warning', 
          text: 'Database is connected but no customer records found.' 
        })
      } else {
        setMessage({ type: '', text: '' })
      }
      
    } catch (error) {
      console.error('❌ Error fetching customers:', error)
      setMessage({ 
        type: 'error', 
        text: `Error: ${error.message}` 
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
        <div className="header-left">
          <h1>Customer Dashboard</h1>
          <p className="header-subtitle">Manage and contact your customers</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchCustomers} className="refresh-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh
          </button>
          <span className="customer-count">
            <strong>{totalCustomers}</strong> total customers
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
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{todayCustomers}</h3>
            <p>Today</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{customers.filter(c => c.phone_number).length}</h3>
            <p>With Phone</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{customers.filter(c => c.email).length}</h3>
            <p>With Email</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="clear-search" onClick={() => setSearch('')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
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
          <div className="table-header">
            <div className="table-info">
              <span className="table-count">{filteredCustomers.length} customers</span>
              {search && <span className="table-filtered">(filtered)</span>}
            </div>
            <div className="table-export">
              <button className="export-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export
              </button>
            </div>
          </div>
          
          {filteredCustomers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>No customers found</h3>
              <p>{search ? 'No customers match your search' : 'Start by adding your first customer'}</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Date Added</th>
                    <th className="actions-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id || customer.created_at}>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {customer.customer_name?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                          <div className="customer-details">
                            <div className="customer-name">
                              {customer.customer_name || 'No name'}
                            </div>
                            <div className="customer-id">
                              ID: {customer.id ? `#${customer.id}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          {customer.phone_number && (
                            <div className="contact-item">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                              <a href={`tel:${customer.phone_number}`} className="contact-link">
                                {customer.phone_number}
                              </a>
                            </div>
                          )}
                          {customer.email && (
                            <div className="contact-item">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                              <a href={`mailto:${customer.email}`} className="contact-link">
                                {customer.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="date-cell">
                        <div className="date-display">
                          {formatDate(customer.created_at)}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {customer.phone_number && (
                            <button 
                              onClick={() => window.open(`tel:${customer.phone_number}`, '_blank')}
                              className="action-btn call-btn"
                              title="Call"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                              </svg>
                            </button>
                          )}
                          {customer.email && (
                            <button 
                              onClick={() => window.open(`mailto:${customer.email}`, '_blank')}
                              className="action-btn email-btn"
                              title="Email"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                            </button>
                          )}
                          {customer.phone_number && (
                            <button 
                              onClick={() => {
                                const phone = customer.phone_number?.replace(/\D/g, '')
                                window.open(`https://wa.me/91${phone}`, '_blank')
                              }}
                              className="action-btn whatsapp-btn"
                              title="WhatsApp"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                              </svg>
                            </button>
                          )}
                          <button 
                            className="action-btn more-btn"
                            title="More options"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        .dashboard-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          gap: 16px;
        }

        .header-left h1 {
          color: #1f2937;
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
        }

        .header-subtitle {
          color: #6b7280;
          margin: 0;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .refresh-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .refresh-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .refresh-btn svg {
          animation: spin 2s linear infinite;
        }

        .customer-count {
          color: #4b5563;
          font-size: 14px;
          background: white;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .customer-count strong {
          color: #3b82f6;
          font-weight: 600;
        }

        .alert {
          padding: 14px 18px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 4px solid;
        }

        .alert-success {
          background-color: #f0fdf4;
          color: #166534;
          border-left-color: #22c55e;
        }

        .alert-error {
          background-color: #fef2f2;
          color: #991b1b;
          border-left-color: #ef4444;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
          border: 1px solid #f3f4f6;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon svg {
          stroke-width: 2;
        }

        .stat-content h3 {
          margin: 0;
          font-size: 32px;
          color: #1f2937;
          font-weight: 700;
          line-height: 1.2;
        }

        .stat-content p {
          margin: 4px 0 0 0;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .search-container {
          position: relative;
          margin-bottom: 24px;
          max-width: 500px;
          background: white;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          padding: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .search-icon {
          padding: 0 12px;
          color: #9ca3af;
        }

        .search-input {
          flex: 1;
          border: none;
          padding: 12px 4px;
          font-size: 15px;
          background: transparent;
          outline: none;
          color: #1f2937;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .clear-search {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
        }

        .clear-search:hover {
          color: #6b7280;
        }

        .loading-container {
          text-align: center;
          padding: 80px 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .customer-table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          border: 1px solid #f3f4f6;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
          background: #f9fafb;
        }

        .table-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .table-count {
          color: #1f2937;
          font-weight: 600;
          font-size: 15px;
        }

        .table-filtered {
          color: #6b7280;
          font-size: 14px;
        }

        .export-btn {
          background: white;
          color: #4b5563;
          border: 1px solid #e5e7eb;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .export-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .customer-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .customer-table th {
          background: #f9fafb;
          padding: 16px 24px;
          text-align: left;
          color: #4b5563;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #f3f4f6;
          white-space: nowrap;
        }

        .customer-table td {
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
        }

        .customer-table tr:hover {
          background: #f9fafb;
        }

        .customer-table tr:last-child td {
          border-bottom: none;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .customer-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          flex-shrink: 0;
        }

        .customer-details {
          min-width: 0;
        }

        .customer-name {
          color: #1f2937;
          font-weight: 600;
          font-size: 15px;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .customer-id {
          color: #9ca3af;
          font-size: 12px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .contact-item svg {
          color: #6b7280;
          flex-shrink: 0;
        }

        .contact-link {
          color: #3b82f6;
          text-decoration: none;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        .date-cell {
          white-space: nowrap;
        }

        .date-display {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .actions-header {
          text-align: center;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          background: white;
          border: 1px solid #e5e7eb;
          color: #6b7280;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .call-btn:hover {
          background: #dcfce7;
          color: #16a34a;
          border-color: #bbf7d0;
        }

        .email-btn:hover {
          background: #dbeafe;
          color: #3b82f6;
          border-color: #bfdbfe;
        }

        .whatsapp-btn:hover {
          background: #f0f9ff;
          color: #0ea5e9;
          border-color: #e0f2fe;
        }

        .more-btn:hover {
          background: #f3f4f6;
          color: #4b5563;
          border-color: #d1d5db;
        }

        .empty-state {
          text-align: center;
          padding: 64px 24px;
          color: #6b7280;
        }

        .empty-icon {
          margin-bottom: 16px;
          color: #d1d5db;
        }

        .empty-state h3 {
          color: #4b5563;
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
          }
          
          .dashboard-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          
          .header-actions {
            justify-content: space-between;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          .stat-card {
            padding: 16px;
          }
          
          .stat-icon {
            width: 48px;
            height: 48px;
          }
          
          .stat-content h3 {
            font-size: 24px;
          }
          
          .customer-table-container {
            border-radius: 8px;
          }
          
          .table-header {
            padding: 16px;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          
          .customer-table td,
          .customer-table th {
            padding: 12px 16px;
          }
          
          .action-buttons {
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .refresh-btn {
            width: 100%;
            justify-content: center;
          }
          
          .customer-count {
            width: 100%;
            text-align: center;
          }
          
          .header-left h1 {
            font-size: 24px;
          }
          
          .customer-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .customer-avatar {
            align-self: center;
          }
        }

        /* Print styles */
        @media print {
          .refresh-btn,
          .export-btn,
          .action-buttons {
            display: none;
          }
          
          .dashboard-container {
            padding: 0;
            background: white;
          }
          
          .customer-table-container {
            box-shadow: none;
            border: 1px solid #ddd;
          }
        }
      `}</style>
    </div>
  )
}

export default CustomerDashboard
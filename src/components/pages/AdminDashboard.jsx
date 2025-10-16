import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminProperties from './AdminProperties'
import '../../styles/AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const checkAdminAccess = useCallback(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (!token || !userStr) {
      navigate('/login')
      return
    }

    try {
      const userData = JSON.parse(userStr)
      if (userData.role !== 'admin') {
        navigate('/')
        return
      }
      setUser(userData)
    } catch {
      navigate('/login')
    }
  }, [navigate])

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const [statsResponse, activitiesResponse] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats', { headers }),
        fetch('http://localhost:5000/api/admin/activities', { headers })
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json()
        setActivities(activitiesData)
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAdminAccess()
    if (activeTab === 'overview') {
      fetchDashboardData()
    }
  }, [activeTab, checkAdminAccess, fetchDashboardData])

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#22c55e'
      case 'sold': return '#ef4444'
      case 'rented': return '#f59e0b'
      case 'new': return '#3b82f6'
      case 'contacted': return '#f59e0b'
      case 'closed': return '#6b7280'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.firstName} {user?.lastName}</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setActiveTab('properties')}
            >
              Add Property
            </button>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            Properties
          </button>
          <button 
            className={`tab ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            Inquiries
          </button>
          <button 
            className={`tab ${activeTab === 'cms' ? 'active' : ''}`}
            onClick={() => setActiveTab('cms')}
          >
            CMS
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {stats && (
                <>
                  {/* Stats Cards */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">🏠</div>
                      <div className="stat-content">
                        <div className="stat-number">{formatNumber(stats.properties.total)}</div>
                        <div className="stat-label">Total Properties</div>
                        <div className="stat-breakdown">
                          <span style={{color: getStatusColor('available')}}>
                            {stats.properties.active} Active
                          </span>
                          <span style={{color: getStatusColor('sold')}}>
                            {stats.properties.sold} Sold
                          </span>
                          <span style={{color: getStatusColor('rented')}}>
                            {stats.properties.rented} Rented
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">📧</div>
                      <div className="stat-content">
                        <div className="stat-number">{formatNumber(stats.inquiries.total)}</div>
                        <div className="stat-label">Total Inquiries</div>
                        <div className="stat-breakdown">
                          <span style={{color: getStatusColor('new')}}>
                            {stats.inquiries.new} New
                          </span>
                          <span style={{color: getStatusColor('contacted')}}>
                            {stats.inquiries.contacted} Contacted
                          </span>
                          <span style={{color: getStatusColor('closed')}}>
                            {stats.inquiries.closed} Closed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">👥</div>
                      <div className="stat-content">
                        <div className="stat-number">{formatNumber(stats.users.total)}</div>
                        <div className="stat-label">Total Users</div>
                        <div className="stat-breakdown">
                          <span>{stats.users.regular} Regular Users</span>
                          <span>{stats.users.admins} Admins</span>
                        </div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">📍</div>
                      <div className="stat-content">
                        <div className="stat-number">{formatNumber(stats.locations)}</div>
                        <div className="stat-label">Locations</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">🔥</div>
                      <div className="stat-content">
                        <div className="stat-number">{formatNumber(stats.properties.featured)}</div>
                        <div className="stat-label">Featured Properties</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">🏷️</div>
                      <div className="stat-content">
                        <div className="stat-number">{formatNumber(stats.categories)}</div>
                        <div className="stat-label">Categories</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  {activities && (
                    <div className="activity-section">
                      <h2>Recent Activity</h2>
                      <div className="activity-grid">
                        <div className="activity-card">
                          <h3>Recent Properties</h3>
                          <div className="activity-list">
                            {activities.properties.slice(0, 5).map(property => (
                              <div key={property._id} className="activity-item">
                                <div className="activity-content">
                                  <div className="activity-title">{property.title}</div>
                                  <div className="activity-meta">
                                    {property.type} • {property.location?.city}
                                  </div>
                                </div>
                                <div className="activity-status" style={{color: getStatusColor(property.status)}}>
                                  {property.status}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="activity-card">
                          <h3>Recent Inquiries</h3>
                          <div className="activity-list">
                            {activities.inquiries.slice(0, 5).map(inquiry => (
                              <div key={inquiry._id} className="activity-item">
                                <div className="activity-content">
                                  <div className="activity-title">{inquiry.name}</div>
                                  <div className="activity-meta">
                                    {inquiry.property?.title} • {inquiry.email}
                                  </div>
                                </div>
                                <div className="activity-status" style={{color: getStatusColor(inquiry.status)}}>
                                  {inquiry.status}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="activity-card">
                          <h3>Recent Users</h3>
                          <div className="activity-list">
                            {activities.users.slice(0, 5).map(user => (
                              <div key={user._id} className="activity-item">
                                <div className="activity-content">
                                  <div className="activity-title">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="activity-meta">
                                    {user.email}
                                  </div>
                                </div>
                                <div className="activity-status">
                                  {user.role}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'properties' && (
            <AdminProperties />
          )}

          {activeTab === 'inquiries' && (
            <div className="tab-content">
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="tab-content">
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="tab-content">
            </div>
          )}

          {activeTab === 'cms' && (
            <div className="tab-content">
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
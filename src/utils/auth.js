// Authentication utilities
let lastKnownServerInstance = localStorage.getItem('serverInstanceId');

// Enhanced fetch wrapper that handles authentication and server restarts
export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Add authorization header if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle 401 responses (invalid/blacklisted tokens)
    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.serverRestarted || errorData.message?.includes('blacklisted')) {
        clearAuth();
        // Redirect to login or show notification
        window.location.href = '/login';
        return response;
      }
    }
    
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Check if server has restarted by comparing instance IDs
export const checkServerStatus = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/server-status', {
      timeout: 5000 // 5 second timeout
    });
    
    if (!response.ok) {
      return { serverAvailable: false, serverRestarted: false };
    }
    
    const data = await response.json();
    const currentInstanceId = data.instanceId;
    
    // If we have a stored instance ID and it's different, server was restarted
    const serverRestarted = lastKnownServerInstance && lastKnownServerInstance !== currentInstanceId;
    
    // Update stored instance ID
    lastKnownServerInstance = currentInstanceId;
    localStorage.setItem('serverInstanceId', currentInstanceId);
    
    return { 
      serverAvailable: true, 
      serverRestarted,
      instanceId: currentInstanceId
    };
  } catch (error) {
    console.error('Server status check failed:', error);
    // Clear stored instance ID when server is not reachable
    localStorage.removeItem('serverInstanceId');
    lastKnownServerInstance = null;
    return { serverAvailable: false, serverRestarted: false };
  }
};

// Clear authentication data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('serverInstanceId');
};

// Check if user is authenticated and tokens are valid
export const checkAuthValidity = async () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return { isAuthenticated: false, user: null };
  }
  
  // Check server status
  const { serverAvailable, serverRestarted } = await checkServerStatus();
  
  if (!serverAvailable) {
    // Server is down, clear authentication to prevent persistent login
    clearAuth();
    return { 
      isAuthenticated: false, 
      user: null, 
      serverDown: true,
      message: 'Server is not available. Please try again later.'
    };
  }
  
  if (serverRestarted) {
    // Server restarted, clear local auth
    clearAuth();
    return { 
      isAuthenticated: false, 
      user: null, 
      serverRestarted: true,
      message: 'Server restarted. Please login again.' 
    };
  }
  
  // Validate token with server
  try {
    const response = await fetch('http://localhost:5000/api/test', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.serverRestarted) {
        clearAuth();
        return { 
          isAuthenticated: false, 
          user: null, 
          serverRestarted: true,
          message: errorData.message || 'Please login again.' 
        };
      }
    }
    
    if (response.ok) {
      const user = JSON.parse(userStr);
      return { isAuthenticated: true, user };
    } else {
      clearAuth();
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.error('Auth validation failed:', error);
    // On network error, keep local auth
    try {
      const user = JSON.parse(userStr);
      return { isAuthenticated: true, user, networkError: true };
    } catch {
      clearAuth();
      return { isAuthenticated: false, user: null };
    }
  }
};
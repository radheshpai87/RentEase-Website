// Authentication guard - checks and clears auth if server is not available
// This should be imported and called on app initialization

import { clearAuth, checkServerStatus } from './auth.js';

export const initializeAuth = async () => {
  const token = localStorage.getItem('token');
  
  // If there's a token, verify server is available
  if (token) {
    try {
      const { serverAvailable } = await checkServerStatus();
      
      if (!serverAvailable) {
        console.log('Server not available, clearing authentication');
        clearAuth();
        return false;
      }
      
      return true;
    } catch {
      console.log('Auth initialization failed, clearing authentication');
      clearAuth();
      return false;
    }
  }
  
  return false;
};
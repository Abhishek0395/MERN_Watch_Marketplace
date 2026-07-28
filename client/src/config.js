export const API_BASE_URL = 'http://localhost:5000';
export const HOME_URL = 'http://localhost:3000';

export const ENDPOINTS = {
  userById: (id) => `${API_BASE_URL}/api/users/${id}`,       // was /api/user
  watchById: (id) => `${API_BASE_URL}/api/watches/${id}`,     // was /api/watch
  allWatches: `${API_BASE_URL}/api/watches`,                  // was /api/watch
  buyWatch: (id) => `${API_BASE_URL}/api/buy/${id}`,           // matches fixed backend
  sellerCreateWatch: `${API_BASE_URL}/api/seller`,
  adminUsers: `${API_BASE_URL}/api/admin/users`,
  adminAllWatches: `${API_BASE_URL}/api/admin/watches`,
  adminPendingWatches: `${API_BASE_URL}/api/admin/watches/pending`,
  adminApproveWatch: (id) => `${API_BASE_URL}/api/admin/watches/${id}/approve`,
  adminRejectWatch: (id) => `${API_BASE_URL}/api/admin/watches/${id}/reject`,
  adminDeleteWatch: (id) => `${API_BASE_URL}/api/admin/watches/${id}`,
  adminDeleteUser: (id) => `${API_BASE_URL}/api/admin/users/${id}`,
};
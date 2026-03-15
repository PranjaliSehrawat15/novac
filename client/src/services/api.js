const BASE_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// AUTH
export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const getMe = () => request('/auth/me');

// USERS
export const registerUser = (userData) =>
  request('/users/register', { method: 'POST', body: JSON.stringify(userData) });

export const getAllUsers = () => request('/users');

// LEADS
export const getLeads = () => request('/leads');

export const createLead = (data) =>
  request('/leads', { method: 'POST', body: JSON.stringify(data) });

export const updateLead = (id, data) =>
  request(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteLead = (id) =>
  request(`/leads/${id}`, { method: 'DELETE' });

// DEALS
export const getDeals = () => request('/deals');

export const createDeal = (data) =>
  request('/deals', { method: 'POST', body: JSON.stringify(data) });

// DASHBOARD
export const getDashboardSummary = () => request('/dashboard/summary');
export const getDashboardPipeline = () => request('/dashboard/pipeline');

// USER PROFILE
export const updateProfile = (data) =>
  request('/auth/update-profile', { method: 'PUT', body: JSON.stringify(data) });

export const changePassword = (data) =>
  request('/auth/change-password', { method: 'PUT', body: JSON.stringify(data) });

export const deactivateSelf = () =>
  request('/auth/deactivate', { method: 'PUT' });

export const updateDeal = (id, data) =>
  request(`/deals/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteDeal = (id) =>
  request(`/deals/${id}`, { method: 'DELETE' });

export const assignLead = (id, employeeId) =>
  request(`/leads/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ employeeId })
  });

export const updateLeadStatus = (id, status) =>
  request(`/leads/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
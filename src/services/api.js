import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('hms_user') || '{}');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {
    localStorage.removeItem('hms_user');
  }
  return config;
});

// Global response error handler
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hms_user');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data || err);
  }
);

// ── Auth ─────────────────────────────────────────────────────────
export const authAPI = {
  register:       (data)   => API.post('/auth/register', data),
  login:          (data)   => API.post('/auth/login', data),
  getMe:          ()       => API.get('/auth/me'),
  updateMe:       (data)   => API.put('/auth/me', data),
  changePassword: (data)   => API.put('/auth/change-password', data),
};

// ── Appointments ─────────────────────────────────────────────────
export const appointmentAPI = {
  getAll:        (params) => API.get('/appointments', { params }),
  getOne:        (id)     => API.get(`/appointments/${id}`),
  book:          (data)   => API.post('/appointments', data),
  updateStatus:  (id, status) => API.put(`/appointments/${id}/status`, { status }),
  cancel:        (id)     => API.put(`/appointments/${id}/cancel`),
  getToday:      ()       => API.get('/appointments/today'),
};

// ── Doctors ──────────────────────────────────────────────────────
export const doctorAPI = {
  getAll:      (params) => API.get('/doctors', { params }),
  getSlots:    (id, date) => API.get(`/doctors/${id}/slots`, { params: { date } }),
};

// ── Prescriptions ─────────────────────────────────────────────────
export const prescriptionAPI = {
  getAll:  ()     => API.get('/prescriptions'),
  getOne:  (id)   => API.get(`/prescriptions/${id}`),
  create:  (data) => API.post('/prescriptions', data),
};

// ── Billing ──────────────────────────────────────────────────────
export const billingAPI = {
  getAll:  (params) => API.get('/billing', { params }),
  create:  (data)   => API.post('/billing', data),
  markPaid:(id)     => API.put(`/billing/${id}/pay`),
};

// ── Admin ─────────────────────────────────────────────────────────
export const adminAPI = {
  getStats:    ()         => API.get('/admin/stats'),
  getUsers:    (params)   => API.get('/admin/users', { params }),
  toggleUser:  (id)       => API.put(`/admin/users/${id}/toggle`),
  deleteUser:  (id)       => API.delete(`/admin/users/${id}`),
};

export default API;

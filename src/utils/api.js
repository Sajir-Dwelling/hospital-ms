import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('hms_user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hms_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data)          => api.post('/auth/register', data),
  login:    (data)          => api.post('/auth/login', data),
  getMe:    ()              => api.get('/auth/me'),
  updatePassword: (data)    => api.put('/auth/update-password', data),
};

// ── Doctors ───────────────────────────────────────────────────
export const doctorAPI = {
  getAll:             (params) => api.get('/doctors', { params }),
  getOne:             (id)     => api.get(`/doctors/${id}`),
  getMyProfile:       ()       => api.get('/doctors/me'),
  updateMyProfile:    (data)   => api.put('/doctors/me', data),
  updateAvailability: (data)   => api.put('/doctors/availability', data),
};

// ── Appointments ──────────────────────────────────────────────
export const appointmentAPI = {
  getAll:       (params) => api.get('/appointments', { params }),
  getOne:       (id)     => api.get(`/appointments/${id}`),
  create:       (data)   => api.post('/appointments', data),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  delete:       (id)     => api.delete(`/appointments/${id}`),
};

// ── Patients ──────────────────────────────────────────────────
export const patientAPI = {
  getAll:         (params) => api.get('/patients', { params }),
  getMyProfile:   ()       => api.get('/patients/me'),
  updateMyProfile:(data)   => api.put('/patients/me', data),
  updateStatus:   (id, status) => api.put(`/patients/${id}/status`, { status }),
};

// ── Prescriptions ─────────────────────────────────────────────
export const prescriptionAPI = {
  getAll:  ()     => api.get('/prescriptions'),
  getOne:  (id)   => api.get(`/prescriptions/${id}`),
  create:  (data) => api.post('/prescriptions', data),
};

// ── Invoices ──────────────────────────────────────────────────
export const invoiceAPI = {
  getAll:    (params) => api.get('/invoices', { params }),
  create:    (data)   => api.post('/invoices', data),
  markPaid:  (id)     => api.put(`/invoices/${id}/pay`),
  getSummary:()       => api.get('/invoices/summary'),
};

// ── Admin ─────────────────────────────────────────────────────
export const adminAPI = {
  getStats:   () => api.get('/admin/stats'),
  getUsers:   () => api.get('/admin/users'),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
};

export default api;

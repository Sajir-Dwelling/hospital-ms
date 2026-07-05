import { createContext, useContext, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('hms_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // Real API login
  const login = async (email, password) => {
    localStorage.removeItem('hms_user');
    const res = await authAPI.login({ email, password });
    const userData = { ...res.data.user, token: res.data.token };
    localStorage.setItem('hms_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // Real API register
  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const userData = { ...res.data.user, token: res.data.token };
    localStorage.setItem('hms_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('hms_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

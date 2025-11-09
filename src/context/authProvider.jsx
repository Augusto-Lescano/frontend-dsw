import React, { useEffect, useState } from 'react';
import { AuthContext } from './authContext.js';
import { loginReq, registerReq, logoutReq, meReq } from '../services/authService.js';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const u = await meReq();
        setUsuario(u);
      } catch {
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (identifier, contrasenia) => {
    const res = await loginReq(identifier, contrasenia);
    setUsuario(res.data);
    return res;
  };

  const register = async (payload) => {
    const data = await registerReq(payload);
    return data;
  };

  const logout = async () => {
    await logoutReq();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authServices';

type Usuario = {
  email: string;
  nome: string;
  foto?: string | null;
  tipo?: string | null;
};

type AuthContextData = {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      const saved = await authService.getUsuarioSalvo();
      if (saved) setUsuario(saved);
      setLoading(false);
    }
    carregarSessao();
  }, []);

  async function login(email: string, senha: string) {
    const data = await authService.loginUsuario(email, senha);
    await authService.salvarSessao(data);
    if (data.usuario) setUsuario(data.usuario);
  }

  async function logout() {
    await authService.logout();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { Usuario, Ong, Role } from '../services/authServices';

type AuthContextData = {
  conta: Usuario | Ong | null;
  role: Role | null;
  loading: boolean;
  login: (identificador: string, senha: string) => Promise<void>; // 👈 sem role aqui
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [conta, setConta] = useState<Usuario | Ong | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      const saved = await authService.getSessaoSalva();
      if (saved) {
        setConta(saved.conta);
        setRole(saved.role);
      }
      setLoading(false);
    }
    carregarSessao();
  }, []);

async function login(identificador: string, senha: string) {
  const data = await authService.loginAuto(identificador, senha);
  await authService.salvarSessao(data);
  setConta(data.conta);
  setRole(data.role);
}

  async function logout() {
    await authService.logout();
    setConta(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ conta, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
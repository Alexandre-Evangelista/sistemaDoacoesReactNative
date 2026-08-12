import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService, { Ong, Role, Usuario } from '../services/authServices';

type AuthContextData = {
  conta: Usuario | Ong | null;
  role: Role | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (identificador: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  excluirConta: () => Promise<void>;
  atualizarFoto: (novaFoto: string) => Promise<void>;
  atualizarConta: (dados: Partial<Usuario | Ong>) => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [conta, setConta] = useState<Usuario | Ong | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const saved = await authService.getSessaoSalva();
        if (saved) {
          setConta(saved.conta);
          setRole(saved.role);
        }
      } catch {
        await authService.logout().catch(() => undefined);
      } finally {
        setLoading(false);
      }
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

  async function excluirConta() {
    if (!conta || !role) throw new Error('Nenhuma conta logada');

    if (role === 'ong') await authService.deleteOng((conta as Ong).cnpj);
    else await authService.deleteUsuario((conta as Usuario).email);

    setConta(null);
    setRole(null);
  }

  async function atualizarConta(dados: Partial<Usuario | Ong>) {
    if (!conta) throw new Error('Nenhuma conta logada');
    const contaAtualizada = { ...conta, ...dados } as Usuario | Ong;
    setConta(contaAtualizada);
    await AsyncStorage.setItem('@app:conta', JSON.stringify(contaAtualizada));
  }

  function atualizarFoto(novaFoto: string) {
    return atualizarConta({ foto: novaFoto });
  }

  return (
    <AuthContext.Provider
      value={{
        conta,
        role,
        loading,
        isAuthenticated: Boolean(conta && role),
        login,
        logout,
        excluirConta,
        atualizarFoto,
        atualizarConta,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}

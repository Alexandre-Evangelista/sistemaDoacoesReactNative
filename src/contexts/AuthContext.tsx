import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { Usuario, Ong, Role } from '../services/authServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextData = {
  conta: Usuario | Ong | null;
  role: Role | null;
  loading: boolean;
  login: (identificador: string, senha: string) => Promise<void>; 
  logout: () => Promise<void>;
  excluirConta: () => Promise<void>;
  atualizarFoto: (novaFoto: string) => Promise<void>;
  atualizarConta: (dados: Partial<Usuario | Ong>) => Promise<void>;
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

  async function excluirConta() {
    if (!conta || !role) {
      throw new Error("Nenhuma conta logada");
    }

    if (role === "ong") {
      await authService.deleteOng((conta as Ong).cnpj);
    } else {
      await authService.deleteUsuario((conta as Usuario).email);
    }

    setConta(null);
    setRole(null);
  }
  async function atualizarConta(dados: Partial<Usuario | Ong>) {
    if (!conta) return;

    const contaAtualizada = { ...conta, ...dados };
    setConta(contaAtualizada);
    await AsyncStorage.setItem('@app:conta', JSON.stringify(contaAtualizada));
  }

  async function atualizarFoto(novaFoto: string) {
    await atualizarConta({ foto: novaFoto });
  }

  return (
    <AuthContext.Provider value={{ conta, role, loading, login, logout, excluirConta, atualizarFoto,atualizarConta  }}>
      {children}
    </AuthContext.Provider>
  );
  
}

export function useAuth() {
  return useContext(AuthContext);
}
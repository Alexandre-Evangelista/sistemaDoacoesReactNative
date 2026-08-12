import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import type { Usuario } from '../models/Usuario';
import type { ONG } from '../models/Ong';
import api from './api';
import { getStoredToken, removeStoredToken, setStoredToken } from './tokenStorage';

type JwtPayload = {
  email?: string;
  cnpj?: string;
  exp?: number;
};

export type Role = 'usuario' | 'ong';
export type { Usuario };
export type Ong = ONG;

export type LoginResponse = {
  token: string;
  role: Role;
  conta: Usuario | ONG;
};

function extractToken(data: unknown) {
  const token = typeof data === 'string'
    ? data
    : typeof data === 'object' && data && 'token' in data
      ? (data as { token?: unknown }).token
      : null;

  if (typeof token !== 'string' || !token) throw new Error('Token não recebido da API');
  return token;
}

function isValidRole(role: string | null): role is Role {
  return role === 'usuario' || role === 'ong';
}

class AuthService {
  async loginUsuario(email: string, senha: string): Promise<LoginResponse> {
    const response = await api.post('/usuario/login', { email, senha });
    const token = extractToken(response.data);
    const payload = jwtDecode<JwtPayload>(token);
    if (!payload.email) throw new Error('Token de usuário inválido');

    const usuarioResponse = await api.get(`/usuario/${encodeURIComponent(payload.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { token, role: 'usuario', conta: usuarioResponse.data };
  }

  async loginOng(cnpj: string, senha: string): Promise<LoginResponse> {
    const cnpjNormalizado = cnpj.replace(/\D/g, '');
    const response = await api.post('/ongs/login', { cnpj: cnpjNormalizado, senha });
    const token = extractToken(response.data);
    const payload = jwtDecode<JwtPayload>(token);
    if (!payload.cnpj) throw new Error('Token de ONG inválido');

    const ongResponse = await api.get(`/ongs/${encodeURIComponent(payload.cnpj)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { token, role: 'ong', conta: ongResponse.data };
  }

  async salvarSessao(data: LoginResponse) {
    try {
      await setStoredToken(data.token);
      await AsyncStorage.multiSet([
        ['@app:role', data.role],
        ['@app:conta', JSON.stringify(data.conta)],
      ]);
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  async logout() {
    await Promise.all([
      removeStoredToken(),
      AsyncStorage.multiRemove(['@app:role', '@app:conta']),
    ]);
  }

  async getSessaoSalva(): Promise<{ conta: Usuario | ONG; role: Role } | null> {
    const [token, rawConta, role] = await Promise.all([
      getStoredToken(),
      AsyncStorage.getItem('@app:conta'),
      AsyncStorage.getItem('@app:role'),
    ]);

    if (!token || !rawConta || !isValidRole(role)) return null;

    const payload = jwtDecode<JwtPayload>(token);
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      await this.logout();
      return null;
    }

    return { conta: JSON.parse(rawConta), role };
  }

  getToken() {
    return getStoredToken();
  }

  loginAuto(identificador: string, senha: string): Promise<LoginResponse> {
    const documento = identificador.replace(/\D/g, '');
    return documento.length === 14
      ? this.loginOng(documento, senha)
      : this.loginUsuario(identificador.trim(), senha);
  }

  async atualizarFotoUsuario(email: string, foto: { uri: string; name: string; type: string }) {
    const formData = new FormData();
    formData.append('foto', foto as unknown as Blob);
    const response = await api.patch(`/usuario/${encodeURIComponent(email)}/foto`, formData);
    return response.data as Usuario;
  }

  async atualizarFotoOng(cnpj: string, foto: { uri: string; name: string; type: string }) {
    const formData = new FormData();
    formData.append('foto', foto as unknown as Blob);
    const response = await api.patch(`/ongs/${encodeURIComponent(cnpj)}/foto`, formData);
    return response.data as ONG;
  }

  async atualizarUsuario(email: string, data: Partial<Omit<Usuario, 'email'>> & { senha?: string }) {
    const response = await api.put(`/usuario/${encodeURIComponent(email)}`, data);
    return response.data as Usuario;
  }

  async deleteUsuario(email: string) {
    await api.delete(`/usuario/${encodeURIComponent(email)}`);
    await this.logout();
  }

  async deleteOng(cnpj: string) {
    await api.delete(`/ongs/${encodeURIComponent(cnpj)}`);
    await this.logout();
  }
}

export default new AuthService();

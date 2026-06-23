import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LoginResponse = {
  token: string;
  usuario?: {
    email: string;
    nome: string;
    foto?: string | null;
    tipo?: string | null;
  };
};

class AuthService {
 async loginUsuario(email: string, senha: string): Promise<LoginResponse> {
  const response = await api.post('/usuario/login', { email, senha });

  return {
    token: response.data,
  };
}
  async salvarSessao(data: LoginResponse) {
  if (!data?.token) {
    throw new Error("Token não recebido da API");
  }

  await AsyncStorage.setItem('@app:token', data.token);

  if (data.usuario) {
    await AsyncStorage.setItem('@app:usuario', JSON.stringify(data.usuario));
  }
}

  async logout() {
    await AsyncStorage.removeItem('@app:token');
    await AsyncStorage.removeItem('@app:usuario');
  }

  async getUsuarioSalvo() {
    const raw = await AsyncStorage.getItem('@app:usuario');
    return raw ? JSON.parse(raw) : null;
  }

  async getToken() {
    return AsyncStorage.getItem('@app:token');
  }
}

export default new AuthService();
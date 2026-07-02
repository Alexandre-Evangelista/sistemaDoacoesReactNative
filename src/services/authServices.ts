import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  email?: string;
  cnpj?: string;
};

export type Role = "usuario" | "ong";

export type Usuario = {
  email: string;
  nome: string;
  foto?: string | null;
  tipo?: string | null;
  cpf?: string | null;
};

export type Ong = {
  cnpj: string;
  nome: string;
  foto?: string | null;
  descricao?: string | null;
};

export type LoginResponse = {
  token: string;
  role: Role;
  conta: Usuario | Ong;
};

class AuthService {
  async loginUsuario(email: string, senha: string): Promise<LoginResponse> {
  const response = await api.post('/usuario/login', { email, senha });
  const token = response.data;

  await AsyncStorage.setItem('@app:token', token);

  const payload = jwtDecode<JwtPayload>(token);
  const usuarioResponse = await api.get(`/usuario/${payload.email}`);
    console.log("USUARIO RESPONSE:", usuarioResponse.data);

    return {
      token,
      role: "usuario",
      conta: usuarioResponse.data,
    };
  }

  async loginOng(cnpj: string, senha: string): Promise<LoginResponse> {
    const response = await api.post('/ongs/login', { cnpj, senha });
    const token = response.data;

    await AsyncStorage.setItem('@app:token', token);

    const payload = jwtDecode<JwtPayload>(token);
    const ongResponse = await api.get(`/ongs/${payload.cnpj}`);
    console.log("ONG RESPONSE:", ongResponse.data);

    return {
      token,
      role: "ong",
      conta: ongResponse.data,
    };
  }

  async salvarSessao(data: LoginResponse) {
    if (!data?.token) {
      throw new Error("Token não recebido da API");
    }

    await AsyncStorage.setItem('@app:token', data.token);
    await AsyncStorage.setItem('@app:role', data.role);

    if (data.conta) {
      await AsyncStorage.setItem('@app:conta', JSON.stringify(data.conta));
    }
  }

  async logout() {
    await AsyncStorage.multiRemove(['@app:token', '@app:role', '@app:conta']);
  }

  async getSessaoSalva(): Promise<{ conta: Usuario | Ong; role: Role } | null> {
    const [rawConta, role] = await Promise.all([
      AsyncStorage.getItem('@app:conta'),
      AsyncStorage.getItem('@app:role'),
    ]);

    if (!rawConta || !role) return null;

    return {
      conta: JSON.parse(rawConta),
      role: role as Role,
    };
  }

  async getToken() {
    return AsyncStorage.getItem('@app:token');
  }

  async loginAuto(identificador: string, senha: string): Promise<LoginResponse> {
  try {
    return await this.loginUsuario(identificador, senha);
  } catch (error: any) {
    // se não achou como usuário, tenta como ONG
    const msg = error?.response?.data;
    const naoEhUsuario =
      error?.response?.status === 400 &&
      (msg === "Usuário não existe! " || msg?.body === "Usuário não existe! ");

    if (naoEhUsuario) {
      return await this.loginOng(identificador, senha);
    }
    throw error; // outro erro (ex: senha incorreta) -> repassa
  }
}
}

export default new AuthService();
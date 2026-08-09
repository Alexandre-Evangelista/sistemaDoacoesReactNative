import api from './api';

export type Doacao = {
  id: string;
  datadoacao: string;
  quantidade: number;
  tipo: string;
  email: string;
  cnpj?: string | null;
  IDcampanha?: string | null;
};

export type CriarDoacaoPayload = Omit<Doacao, 'id'>;
export type AtualizarDoacaoPayload = Omit<Doacao, 'id' | 'email'>;

class DoacaoService {
  async criarDoacao(data: CriarDoacaoPayload) {
    const response = await api.post('/doacao/usuario', data);
    return response.data;
  }

  // Assumindo que o backend retorna a lista de doações do usuário logado (via token)
  async listarDoacoes(): Promise<Doacao[]> {
    const response = await api.get('/doacao/usuario');
    return response.data;
  }

  async atualizarDoacao(id: string, data: AtualizarDoacaoPayload) {
    const response = await api.put(`/doacao/usuario/${id}`, data);
    return response.data;
  }

  async deletarDoacao(id: string) {
    const response = await api.delete(`/doacao/usuario/${id}`);
    return response.data;
  }
}

export default new DoacaoService();
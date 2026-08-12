import type { Doacao } from '../models/Doacao';
import api from './api';

export type { Doacao };

export type CriarDoacaoPayload = {
  datadoacao: string;
  quantidade: number;
  tipo: string;
  email: string;
  cnpj?: string | null;
  IDcampanha?: string | null;
};

export type AtualizarDoacaoPayload = Omit<CriarDoacaoPayload, 'email'>;

class DoacaoService {
  async criarDoacao(data: CriarDoacaoPayload) {
    const response = await api.post('/doacao/usuario', data);
    return response.data as Doacao;
  }

  async listarDoacoes(): Promise<Doacao[]> {
    const response = await api.get('/doacao/usuario');
    return response.data;
  }

  async atualizarDoacao(id: string, data: AtualizarDoacaoPayload) {
    const response = await api.put(`/doacao/usuario/${encodeURIComponent(id)}`, data);
    return response.data as Doacao;
  }

  async deletarDoacao(id: string) {
    const response = await api.delete(`/doacao/usuario/${encodeURIComponent(id)}`);
    return response.data;
  }
}

export default new DoacaoService();

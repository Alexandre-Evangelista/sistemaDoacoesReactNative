import api from './api';

export type CriarCampanhaPayload = {
  nome: string;
  descricao: string;
  foto: { uri: string; name: string; type: string };
  latitude?: number;
  longitude?: number;
  cnpjOng: string;
};
export type AtualizarCampanhaPayload = {
  descricao?: string;
  latitude?: number;
  longitude?: number;
  cnpjOng: string;
};

class CampanhaService {
  async criarCampanha(data: CriarCampanhaPayload) {
    const formData = new FormData();
    formData.append('nome', data.nome);
    formData.append('descricao', data.descricao);
    formData.append('cnpjOng', data.cnpjOng);
    if (data.latitude != null) formData.append('latitude', String(data.latitude));
    if (data.longitude != null) formData.append('longitude', String(data.longitude));

    formData.append('foto', {
      uri: data.foto.uri,
      name: data.foto.name,
      type: data.foto.type,
    } as unknown as Blob);

    const response = await api.post('/campanha/registar', formData);

    return response.data;
  }

  async atualizarCampanha(id: string, data: AtualizarCampanhaPayload) {
    const response = await api.put(`/campanha/${id}`, data);
    return response.data;
  }

  async deletarCampanha(id: string) {
    const response = await api.delete(`/campanha/${id}`);
    return response.data;
  }
}

export default new CampanhaService();

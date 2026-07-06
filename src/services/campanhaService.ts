import api from './api';

export type CriarCampanhaPayload = {
  nome: string;
  descricao: string;
  foto: { uri: string; name: string; type: string };
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
    if (data.latitude) formData.append('latitude', String(data.latitude));
    if (data.longitude) formData.append('longitude', String(data.longitude));

    formData.append('foto', {
      uri: data.foto.uri,
      name: data.foto.name,
      type: data.foto.type,
    } as any);

    const response = await api.post('/campanha/registar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  }
}

export default new CampanhaService();
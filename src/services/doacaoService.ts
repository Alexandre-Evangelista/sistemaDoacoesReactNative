import api from './api';

export type CriarDoacaoPayload = {
  quantidade: number;
  tipo: string;
  IDcampanha: string;
  latitude?: number;
  longitude?: number;
};

class DoacaoService {
 
  async listarDoacoesUsuario() {
    
    const response = await api.get('/doacao/minhas-doacoes'); 
    return response.data;
  }

  
  async criarDoacao(data: CriarDoacaoPayload) {
    const body = {
      quantidade: data.quantidade,
      tipo: data.tipo,
      IDcampanha: data.IDcampanha,
      
      geolocalizacao: data.latitude && data.longitude ? {
        type: "Point",
        coordinates: [data.longitude, data.latitude]
      } : null
    };

    const response = await api.post('/doacao', body);
    return response.data;
  }
}

export default new DoacaoService();
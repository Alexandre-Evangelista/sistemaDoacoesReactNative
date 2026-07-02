import { Campanha } from './Campanha';
import { ONG } from './Ong';
import { Usuario } from './Usuario';

export interface Doacao {
  id: string;
  datadoacao: string;
  quantidade: number;
  tipo: string;

  email?: string | null;
  cnpj?: string | null;
  IDcampanha?: string | null;

  usuario?: Usuario;
  ong?: ONG;
  campanha?: Campanha;
}
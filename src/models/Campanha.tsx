import { ONG } from './Ong';
import { Doacao } from './Doacao';

export interface Campanha {
  id: string;
  nome: string;
  descricao: string;
  foto: string;

  latitude?: number | null;
  longitude?: number | null;

  datacriacao?: string;
  cnpjOng?: string | null;

  ong?: ONG;
  doacoes?: Doacao[];
}
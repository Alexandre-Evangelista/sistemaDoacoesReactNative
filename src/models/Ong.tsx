import { Campanha } from './Campanha';
import { Doacao } from './Doacao';

export interface ONG {
  cnpj: string;
  nome: string;
  telefone?: string | null;
  descricao?: string | null;
  foto?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  campanhas?: Campanha[];
  avaliacoes?: any[];     // se não tiver model de Avaliacao ainda
  doacoes?: Doacao[];
}
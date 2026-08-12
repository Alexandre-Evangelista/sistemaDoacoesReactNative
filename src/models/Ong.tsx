import { Campanha } from './Campanha';
import { Doacao } from './Doacao';

export interface ONG {
  cnpj: string;
  nome: string;
  email?: string | null;
  tipo?: boolean | null;
  telefone?: string | null;
  descricao?: string | null;
  foto?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  campanhas?: Campanha[];
  avaliacoes?: unknown[];
  doacoes?: Doacao[];
}

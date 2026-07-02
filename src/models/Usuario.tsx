// Usuario.ts
export interface Usuario {
  id: string;
  email: string;
  nome: string;

  latitude?: number | null;
  longitude?: number | null;

  foto?: string | null;
  tipo?: boolean | null;
  telefone?: string | null;
  cpf?: string | null;
  cnpj?: string | null;
}
export type UserRole = 'ALUNO' | 'PROFESSOR' | 'EMPRESA' | 'ADMIN';

export interface Instituicao {
  id: number;
  nome: string;
  cnpj?: string;
  endereco?: string;
}

export interface AlunoRequest {
  email: string;
  senha: string;
  cpf: string;
  rg: string;
  nome: string;
  endereco?: string;
  curso: string;
  instituicaoId: number;
}

export interface AlunoResponse {
  id: number;
  email: string;
  cpf: string;
  rg: string;
  nome: string;
  endereco?: string;
  curso: string;
  saldoMoedas: number;
  instituicaoId: number;
  instituicaoNome: string;
}

export interface EmpresaRequest {
  email: string;
  senha: string;
  cnpj: string;
  nomeFantasia: string;
  descricao?: string;
}

export interface EmpresaResponse {
  id: number;
  email: string;
  cnpj: string;
  nomeFantasia: string;
  descricao?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipoUsuario: UserRole;
  usuarioId: number;
  nome: string;
}

export type TipoTransacaoApi = 'ENVIO_MOEDA' | 'RESGATE_VANTAGEM';

export interface TransacaoResponse {
  id: number;
  tipo: TipoTransacaoApi;
  valor: number;
  dataHora: string;
  descricao: string;
  alunoId: number | null;
  alunoNome: string | null;
}

export interface StudentProfile {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco?: string;
  curso: string;
  instituicaoId: number;
  instituicaoNome: string;
  saldoMoedas: number;
}

export interface UpdateProfileRequest {
  nome: string;
  email: string;
  endereco?: string;
  senha?: string;
}

export interface ProfessorResponse {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  departamento: string;
  instituicaoId: number;
  instituicaoNome: string;
  saldoMoedas: number;
}

export interface DistribuirMoedasRequest {
  alunoId: number;
  quantidade: number;
  mensagem: string;
}

export interface ExtratoResponse {
  saldoAtual: number;
  transacoes: TransacaoResponse[];
}

export type Student = AlunoResponse;

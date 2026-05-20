export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Emprunt {
  isbn: string;
  idUtilisateur: number;
}

export interface EmpruntResponse {
  id: number;
  message: string;
  isbn: string;
  idUtilisateur: number;
  dateEmprunt: string;
  dateRetourPrevue: string;
  idStatut: number;
}

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

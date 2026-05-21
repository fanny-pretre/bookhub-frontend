export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
}

export interface RegisterDto {
  nom: string;
  prenom: string;
  email: string;
  mdp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

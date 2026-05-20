// Auteur tel que retourné par le backend
export interface Auteur {
  id: number;
  nom: string;
  prenom: string;
}

// Payload pour création (POST /api/auteurs)
export interface CreateAuteurRequest {
  nom: string;
  prenom: string;
}

// Wrapper API Spring
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

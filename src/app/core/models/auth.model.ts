// Interface représentant les données envoyées au backend lors de l'inscription
// Correspond au payload attendu par POST /api/auth/register
export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

// Interface représentant la réponse du backend
// Les deux champs sont optionnels car le back renvoie l'un ou l'autre selon le cas
export interface AuthResponse {
  message?: string; // Présent en cas de succès
  error?: string; // Présent en cas d'erreur métier (email déjà utilisé, etc.)
}

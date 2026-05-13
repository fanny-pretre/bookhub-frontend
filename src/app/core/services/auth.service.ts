import { Injectable } from '@angular/core';
// HttpClient est le service Angular pour faire des requêtes HTTP
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest, AuthResponse } from '../models/auth.model';

// @Injectable({ providedIn: 'root' }) signifie que ce service est un singleton
// disponible dans toute l'application sans avoir à le déclarer ailleurs
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL de base de l'API backend
  private apiUrl = 'http://localhost:8080/api/auth';

  // HttpClient est injecté automatiquement par Angular grâce au système d'injection de dépendances
  constructor(private http: HttpClient) {}

  // Méthode d'inscription : envoie un POST avec les données du formulaire
  // Retourne un Observable<AuthResponse> le composant s'y abonnera avec .subscribe()
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }
}

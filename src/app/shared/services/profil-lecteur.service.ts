import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UpdateProfilPayload {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
}

export interface UpdateMdpPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({ providedIn: 'root' })
export class ProfilService {
  private readonly API = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  updateProfil(id: number, payload: UpdateProfilPayload): Observable<any> {
    return this.http.put(`${this.API}/users/${id}`, payload, { headers: this.headers });
  }

  updateMotDePasse(id: number, payload: UpdateMdpPayload): Observable<any> {
    return this.http.put(`${this.API}/users/${id}/password`, payload, { headers: this.headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';

import { Utilisateur, ApiResponse } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private readonly API = 'http://localhost:8080/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  getUserById(id: number): Observable<Utilisateur> {
    return this.http
      .get<ApiResponse<Utilisateur>>(`${this.API}/${id}`, { headers: this.headers })
      .pipe(map((response) => response.data));
  }

  getAllUsers(): Observable<Utilisateur[]> {
    return this.http
      .get<ApiResponse<Utilisateur[]>>(this.API, {
        headers: this.headers,
      })
      .pipe(map((response) => response.data));
  }
}

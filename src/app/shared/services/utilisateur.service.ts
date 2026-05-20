import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Utilisateur, ApiResponse, RegisterDto } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private readonly API_USERS = 'http://localhost:8080/api/users';
  private readonly API_AUTH = 'http://localhost:8080/api/auth';

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
      .get<ApiResponse<Utilisateur>>(`${this.API_USERS}/${id}`, {
        headers: this.headers,
      })
      .pipe(map((response) => response.data));
  }

  getAllUsers(): Observable<Utilisateur[]> {
    return this.http
      .get<ApiResponse<Utilisateur[]>>(this.API_USERS, {
        headers: this.headers,
      })
      .pipe(map((response) => response.data));
  }

  createUser(user: RegisterDto): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(`${this.API_AUTH}/register`, user, {
        headers: this.headers,
      })
      .pipe(map((response) => response.data));
  }

  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.API_USERS}/${id}`, {
        headers: this.headers,
      })
      .pipe(map((response) => response.data));
  }
}

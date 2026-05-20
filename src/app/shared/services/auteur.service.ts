import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Auteur, ApiResponse } from '../models/auteur.model';

@Injectable({ providedIn: 'root' })
export class AuteurService {
  private apiUrl = 'http://localhost:8080/api/auteurs';

  constructor(private http: HttpClient) {}

  createAuteur(payload: { nom: string; prenom: string }) {
    return this.http.post<ApiResponse<Auteur>>(this.apiUrl, payload).pipe(map((res) => res.data));
  }

  getAllAuteurs() {
    return this.http.get<ApiResponse<Auteur[]>>(this.apiUrl).pipe(map((res) => res.data));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Emprunt, EmpruntResponse } from '../models/emprunt.model';

@Injectable({
  providedIn: 'root',
})
export class EmpruntService {
  private apiUrl = 'http://localhost:8080/api/loans';

  constructor(private http: HttpClient) {}

  getAllLoans(): Observable<EmpruntResponse[]> {
    return this.http
      .get<ApiResponse<EmpruntResponse[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getLoanById(id: number): Observable<EmpruntResponse> {
    return this.http
      .get<ApiResponse<EmpruntResponse>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  createLoan(emprunt: Emprunt): Observable<EmpruntResponse> {
    return this.http
      .post<ApiResponse<EmpruntResponse>>(this.apiUrl, emprunt)
      .pipe(map((response) => response.data));
  }

  returnLoan(id: number): Observable<EmpruntResponse> {
    return this.http
      .post<ApiResponse<EmpruntResponse>>(`${this.apiUrl}/${id}/return`, {})
      .pipe(map((response) => response.data));
  }
}

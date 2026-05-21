import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface EmpruntResponseDTO {
  id: number;
  message: string;
  isbn: string;
  idUtilisateur: number;
  dateEmprunt: string; // LocalDate → string ISO (ex: "2026-04-15")
  dateRetourPrevue: string;
  idStatut: number; // 1 = Terminé, 2 = En cours, 3 = Refusé
}

export interface ReservationResponseDTO {
  id: number;
  message: string;
  isbn: string;
  queuePosition: number;
  status: string;
  bookTitle: string;
  reservationDate: string; // LocalDate → string ISO
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class MesEmpruntsService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les emprunts d'un utilisateur (en cours + historique)
   * Endpoint : GET /api/loans/my/{userId}
   */
  getLoansByUser(userId: number): Observable<EmpruntResponseDTO[]> {
    return this.http
      .get<ApiResponse<EmpruntResponseDTO[]>>(`${this.apiUrl}/loans/my/${userId}`)
      .pipe(map((res) => res.data));
  }

  /**
   * Récupère les réservations de l'utilisateur connecté
   * Endpoint : GET /api/reservations/my  (authentification via JWT/session)
   */
  getMyReservations(): Observable<ReservationResponseDTO[]> {
    return this.http
      .get<ApiResponse<ReservationResponseDTO[]>>(`${this.apiUrl}/reservations/my`)
      .pipe(map((res) => res.data));
  }

  /**
   * Annule une réservation
   * Endpoint : DELETE /api/reservations/{id}
   */
  deleteReservation(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/reservations/${id}`)
      .pipe(map(() => undefined));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reservation, ReservationResponse, ApiResponse } from '../models/reservation.model';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ReservationResponse {
  id: number;
  message: string;
  isbn: string;
  queuePosition: number;
  status: string;
  bookTitle: string;
  reservationDate: string;
}

export interface EmpruntResponse {
  id: number;
  message: string;
  isbn: string;
  idUtilisateur: number;
  dateEmprunt: string;
  dateRetourPrevue: string;
  idStatut: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

 createReservation(reservation: Reservation): Observable<ReservationResponse> {
  return this.http
    .post<ApiResponse<ReservationResponse>>(this.apiUrl, reservation)
    .pipe(map(res => res.data));
}
  getAllReservations(): Observable<ApiResponse<ReservationResponse[]>> {
    return this.http.get<ApiResponse<ReservationResponse[]>>(this.apiUrl);
  }

getMyReservations(): Observable<ReservationResponse[]> {
  return this.http
    .get<ApiResponse<ReservationResponse[]>>(
      'http://localhost:8080/api/reservations/my'
    )
    .pipe(map(res => res.data));
}
  validateReservation(id: number): Observable<ApiResponse<EmpruntResponse>> {
    return this.http.post<ApiResponse<EmpruntResponse>>(`${this.apiUrl}/${id}/validate`, {});
  }
}

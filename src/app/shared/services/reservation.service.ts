import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reservation, ReservationResponse, ApiResponse } from '../models/reservation.model';


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

getMyReservations(): Observable<ReservationResponse[]> {
  return this.http
    .get<ApiResponse<ReservationResponse[]>>(
      'http://localhost:8080/api/reservations/my'
    )
    .pipe(map(res => res.data));
}
}
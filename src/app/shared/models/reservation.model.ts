export interface Reservation {
  isbn: string;
}
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
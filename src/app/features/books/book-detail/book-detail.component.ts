import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiResponse, Book } from '../../../shared/models/book.model';
import { switchMap } from 'rxjs';
import { Navbar } from '../../../core/navbar/navbar';
import { ReservationService } from '../../../shared/services/reservation.service';


@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit {
  // null au départ, le template utilise *ngIf="book" pour éviter les erreurs
  book: Book | null = null;

  isLoading = true;
  errorMessage = '';
  successMessage = ''; 
  showToast = false; // Contrôle l'affichage du toast de confirmation d'emprunt

  reservationStatus: {
  reserved: boolean;
  queued: boolean;
  queuePosition: number | null;
} | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient, // Pour appeler l'API
    private cdr: ChangeDetectorRef, // Pour forcer la détection des changements avec SSR
    private reservationService: ReservationService
  ) {}

 ngOnInit(): void {
  this.route.paramMap
    .pipe(
      switchMap((params) => {
        const isbn = params.get('isbn');
        this.book = null;
        this.isLoading = true;
        this.errorMessage = '';

        if (!isbn) throw new Error('ISBN invalide');

        return this.http.get<ApiResponse<Book>>(`http://localhost:8080/api/books/${isbn}`);
      }),
    )
    .subscribe({
      next: (response) => {
        this.book = response.data;
        this.isLoading = false;
        this.cdr.detectChanges();

        // ✅ On vérifie si ce livre est déjà réservé par l'utilisateur
        this.checkExistingReservation(this.book.isbn);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement du livre';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
}

private checkExistingReservation(isbn: string): void {
  this.reservationService.getMyReservations().subscribe({
    next: (reservations) => {
      const existing = reservations.find(r => r.isbn === isbn);

      if (existing) {
        this.reservationStatus = {
          reserved: true,
          queued: existing.queuePosition > 0,
          queuePosition: existing.queuePosition > 0 ? existing.queuePosition : null
        };
        this.cdr.detectChanges();
      }
    },
    error: () => {}
  });
}

  // Déclenché par le bouton "Emprunter", affiche un toast de confirmation
  handleBorrow(): void {
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 1000);
  }

 handleReserve(): void {
  if (!this.book?.isbn) return;

  this.reservationService.createReservation({ isbn: this.book.isbn })
    .subscribe({
      next: (res) => {
        this.reservationStatus = {
          reserved: true,
          queued: !!res.queuePosition && res.queuePosition > 0,
          queuePosition: res.queuePosition ?? null
        };

        this.successMessage = this.reservationStatus.queued
          ? `⏳ Ajouté en file (position ${res.queuePosition})`
          : `✅ Réservation confirmée !`;

        this.showToast = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.showToast = false;
          this.cdr.detectChanges();
        }, 3000);
      },

      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erreur lors de la réservation';
      }
    });
}}

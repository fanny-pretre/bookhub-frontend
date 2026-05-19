import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Navbar } from '../../../core/navbar/navbar';

import {
  ReservationService,
  ReservationResponse,
} from '../../../shared/services/reservation.service';

@Component({
  selector: 'app-reservations-validation',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './reservations-validation.html',
  styleUrl: './reservations-validation.css',
})
export class ReservationsValidation implements OnInit {
  reservations: ReservationResponse[] = [];

  activeReservations: ReservationResponse[] = [];

  loading = false;

  successMessage = '';

  errorMessage = '';

  validatingId: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    // Évite les appels API côté serveur Angular (SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.loadReservations();
    }
  }

  get reservationsCount(): number {
    return this.activeReservations.length;
  }

  loadReservations(): void {
    this.loading = true;

    this.successMessage = '';

    this.errorMessage = '';

    this.reservationService.getAllReservations().subscribe({
      next: (response) => {
        console.log('Réservations reçues :', response);

        this.reservations = response.data ?? [];

        // On garde uniquement les réservations "En cours"
        this.activeReservations = this.reservations.filter(
          (reservation) => reservation.status === 'En cours',
        );

        this.loading = false;

        // Force le refresh Angular
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Erreur chargement réservations :', error);

        this.reservations = [];

        this.activeReservations = [];

        this.errorMessage = error.error?.message || 'Impossible de charger les réservations.';

        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }

  validateReservation(id: number): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.validatingId = id;

    this.reservationService.validateReservation(id).subscribe({
      next: (response) => {
        this.successMessage = response.message;

        this.reservations = this.reservations.filter((reservation) => reservation.id !== id);

        this.activeReservations = this.activeReservations.filter(
          (reservation) => reservation.id !== id,
        );

        this.validatingId = null;
        this.cdr.detectChanges();
      },

      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de la validation.';

        this.validatingId = null;
        this.cdr.detectChanges();
      },
    });
  }
}

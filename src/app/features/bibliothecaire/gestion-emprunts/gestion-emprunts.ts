import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { forkJoin } from 'rxjs';

import { Navbar } from '../../../core/navbar/navbar';

import { ReservationService } from '../../../shared/services/reservation.service';
import { EmpruntService } from '../../../shared/services/emprunt.service';
import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { BookService } from '../../../shared/services/book.service';

import { ReservationResponse } from '../../../shared/models/reservation.model';
import { EmpruntResponse } from '../../../shared/models/emprunt.model';
import { Utilisateur } from '../../../shared/models/utilisateur.model';
import { Book } from '../../../shared/models/book.model';

const STATUT_RETOURNE = 1;
const STATUT_EN_COURS = 2;

@Component({
  selector: 'app-gestion-emprunts',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './gestion-emprunts.html',
  styleUrl: './gestion-emprunts.css',
})
export class GestionEmpruntsComponent implements OnInit {
  activeTab: 'en-cours' | 'a-valider' | 'retard' | 'historique' = 'en-cours';

  reservations: ReservationResponse[] = [];
  activeReservations: ReservationResponse[] = [];
  emprunts: EmpruntResponse[] = [];

  bookTitleMap = new Map<string, string>();
  usersMap = new Map<number, Utilisateur>();

  loading = false;
  successMessage = '';
  errorMessage = '';

  validatingId: number | null = null;
  returningId: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private empruntService: EmpruntService,
    private utilisateurService: UtilisateurService,
    private bookService: BookService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
  }

  loadData(): void {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    forkJoin({
      reservations: this.reservationService.getAllReservations(),
      emprunts: this.empruntService.getAllLoans(),
      books: this.bookService.getAllBooks(),
      users: this.utilisateurService.getAllUsers(),
    }).subscribe({
      next: ({ reservations, emprunts, books, users }) => {
        this.reservations = reservations ?? [];

        this.activeReservations = this.reservations.filter(
          (reservation) => reservation.status === 'En cours',
        );

        this.emprunts = emprunts ?? [];

        this.bookTitleMap = new Map(books.map((book: Book) => [book.isbn, book.titre]));

        this.usersMap = new Map(users.map((user: Utilisateur) => [Number(user.id), user]));

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Erreur chargement données :', error);

        this.reservations = [];
        this.activeReservations = [];
        this.emprunts = [];

        this.errorMessage = error.error?.message || 'Impossible de charger les données.';

        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  setTab(tab: 'en-cours' | 'a-valider' | 'retard' | 'historique'): void {
    this.activeTab = tab;
  }

  validateReservation(id: number): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.validatingId = id;

    this.reservationService.validateReservation(id).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.validatingId = null;

        this.loadData();
        this.cdr.detectChanges();
      },

      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de la validation.';

        this.validatingId = null;
        this.cdr.detectChanges();
      },
    });
  }

  returnLoan(id: number): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.returningId = id;

    this.empruntService.returnLoan(id).subscribe({
      next: () => {
        this.successMessage = 'Retour enregistré avec succès';
        this.returningId = null;

        this.loadData();
        this.cdr.detectChanges();
      },

      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du retour du livre.';

        this.returningId = null;
        this.cdr.detectChanges();
      },
    });
  }

  get reservationsCount(): number {
    return this.activeReservations.length;
  }

  get empruntsEnCours(): EmpruntResponse[] {
    return this.emprunts.filter((emprunt) => emprunt.idStatut === STATUT_EN_COURS);
  }

  get empruntsHistorique(): EmpruntResponse[] {
    return this.emprunts.filter((emprunt) => emprunt.idStatut === STATUT_RETOURNE);
  }

  get empruntsEnRetard(): EmpruntResponse[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.empruntsEnCours.filter((emprunt) => {
      const dueDate = new Date(emprunt.dateRetourPrevue);
      dueDate.setHours(0, 0, 0, 0);

      return dueDate < today;
    });
  }

  getUserName(emprunt: EmpruntResponse): string {
    const user = this.usersMap.get(Number(emprunt.idUtilisateur));

    return user ? `${user.prenom} ${user.nom}` : `Utilisateur #${emprunt.idUtilisateur}`;
  }

  getBookTitle(emprunt: EmpruntResponse): string {
    return this.bookTitleMap.get(emprunt.isbn) ?? emprunt.isbn;
  }

  getDaysLeft(dateRetourPrevue: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(dateRetourPrevue);
    dueDate.setHours(0, 0, 0, 0);

    const diffMs = dueDate.getTime() - today.getTime();

    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  formatDate(date: string): string {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
}

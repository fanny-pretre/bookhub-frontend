import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, switchMap, filter, catchError } from 'rxjs/operators';
import { Navbar } from '../../../core/navbar/navbar';
import { AuthService } from '../../../shared/services/auth.service';
import { AbsPipe } from '../../../abs.pipe';
import {
  EmpruntResponseDTO,
  MesEmpruntsService,
  ReservationResponseDTO,
} from '../../../shared/services/mesEmprunts.service';
import { BookService } from '../../../shared/services/book.service';

export interface Loan {
  id: number;
  title: string;
  borrowDate: string;
  coverUrl: string;
  dueDate: string;
  daysLeft: number;
  overdue: boolean;
}

export interface HistoryLoan {
  id: number;
  title: string;
  coverUrl: string;
  borrowDate: string;
  returnDate: string;
}

export interface Reservation {
  id: number;
  title: string;
  reservedDate: string;
  position: number;
  estimatedDate: string;
  coverUrl: string;
}

const STATUT_TERMINE = 1;
const STATUT_ENCOURS = 2;

@Component({
  selector: 'app-mes-emprunts',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, AbsPipe],
  templateUrl: './mes-emprunts.html',
  styleUrl: './mes-emprunts.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MesEmpruntsComponent implements OnInit, OnDestroy {
  activeTab: 'progress' | 'history' | 'reservations' = 'progress';

  successMessage: string | null = null;
  inProgressLoans: Loan[] = [];
  historyLoans: HistoryLoan[] = [];
  reservations: Reservation[] = [];

  isLoading = true;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private mesEmpruntsService: MesEmpruntsService,
    private cdr: ChangeDetectorRef,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        filter((user) => !!user),
        takeUntil(this.destroy$),

        switchMap((user) => {
          const userId = user.id ?? user.idUtilisateur ?? user.userId;

          this.isLoading = true;
          this.errorMessage = null;

          return forkJoin({
            loans: this.mesEmpruntsService.getLoansByUser(userId),
            reservations: this.mesEmpruntsService.getMyReservations(),
            books: this.bookService.getAllBooks(),
          });
        }),
      )
      .subscribe(({ loans, reservations, books }) => {
        const bookMap = new Map(
          books.map((book) => [book.isbn, { titre: book.titre, couverture: book.couverture }]),
        );

        this.processLoans(loans, bookMap);
        this.processReservations(reservations, bookMap); // ← passer bookMap

        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Transformation DTO → modèle vue ──────────────────────────────────────

  private processLoans(
    loans: EmpruntResponseDTO[],
    bookMap: Map<string, { titre: string; couverture: string }>,
  ): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.inProgressLoans = loans
      .filter((l) => l.idStatut === STATUT_ENCOURS)
      .map((l) => {
        const book = bookMap.get(l.isbn);
        const dueDate = new Date(l.dateRetourPrevue);
        const diffMs = dueDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return {
          id: l.id,
          title: book?.titre ?? l.isbn,
          coverUrl: book?.couverture ?? '', // ← ajout
          borrowDate: this.formatDate(l.dateEmprunt),
          dueDate: this.formatDate(l.dateRetourPrevue),
          daysLeft,
          overdue: daysLeft < 0,
        };
      });

    this.historyLoans = loans
      .filter((l) => l.idStatut === STATUT_TERMINE)
      .map((l) => {
        const book = bookMap.get(l.isbn);
        return {
          id: l.id,
          title: book?.titre ?? l.isbn,
          coverUrl: book?.couverture ?? '', // ← ajout
          borrowDate: this.formatDate(l.dateEmprunt),
          returnDate: this.formatDate(l.dateRetourPrevue),
        };
      });
  }

  private processReservations(
    reservations: ReservationResponseDTO[],
    bookMap: Map<string, { titre: string; couverture: string }>,
  ): void {
    this.reservations = reservations
      .filter((r) => r.status === 'En cours' || r.status === 'Liste attente')
      .map((r) => ({
        id: r.id,
        title: r.bookTitle,
        coverUrl: bookMap.get(r.isbn)?.couverture ?? '', // ← ajout
        reservedDate: this.formatDate(r.reservationDate),
        position: r.queuePosition ?? 0,
        estimatedDate: '—',
      }));
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  setTab(tab: 'progress' | 'history' | 'reservations'): void {
    this.activeTab = tab;
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3000);
    this.cdr.detectChanges();
  }

  cancelReservation(id: number): void {
    this.mesEmpruntsService
      .deleteReservation(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          forkJoin({
            reservations: this.mesEmpruntsService.getMyReservations(),
            books: this.bookService.getAllBooks(),
          })
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ reservations, books }) => {
              const bookMap = new Map(
                books.map((b) => [b.isbn, { titre: b.titre, couverture: b.couverture }])
              );
              this.processReservations(reservations, bookMap);
              this.showSuccess('Vous avez bien annulé la réservation.');
            });
        },
        error: (err) => {
          console.error('Erreur suppression réservation', err);
          this.errorMessage = 'Impossible annuler la réservation.';
          this.cdr.detectChanges();
        },
      });
  }

  // ── Computed ─────────────────────────────────────────────────────────────

  get overdueCount(): number {
    return this.inProgressLoans.filter((l) => l.overdue).length;
  }

  getGradient(id: number): string {
    const palette = [
      'gradient-indigo',
      'gradient-rose',
      'gradient-emerald',
      'gradient-amber',
      'gradient-violet',
      'gradient-lime',
      'gradient-sky',
      'gradient-cyan',
    ];
    return palette[id % palette.length];
  }

  // ── Utilitaires ──────────────────────────────────────────────────────────

  private formatDate(isoDate: string | null | undefined): string {
    if (!isoDate) return '—';
    return new Date(isoDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

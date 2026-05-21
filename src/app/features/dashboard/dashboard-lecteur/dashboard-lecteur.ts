import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, switchMap, filter } from 'rxjs/operators';
import { Navbar } from '../../../core/navbar/navbar';
import { AuthService } from '../../../shared/services/auth.service';
import {
  EmpruntResponseDTO,
  MesEmpruntsService,
  ReservationResponseDTO,
} from '../../../shared/services/mesEmprunts.service';
import { BookService } from '../../../shared/services/book.service';

const STATUT_TERMINE = 1;
const STATUT_ENCOURS = 2;

export interface Loan {
  id: number;
  title: string;
  dueDate: string;
  overdue: boolean;
}

export interface Reservation {
  id: number;
  title: string;
  status: string;
}

export interface RecentBook {
  id: number;
  title: string;
  author: string;
  readDate: string;
  cover: string;
}

@Component({
  selector: 'app-dashboard-lecteur',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './dashboard-lecteur.html',
  styleUrl: './dashboard-lecteur.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLecteur implements OnInit, OnDestroy {
  userName = 'Utilisateur';
  isLoading = true;

  loans: Loan[] = [];
  reservations: Reservation[] = [];
  recentBooks: RecentBook[] = [];

  readingGoalTotal = 24;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private mesEmpruntsService: MesEmpruntsService,
    private bookService: BookService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        filter((user) => !!user),
        takeUntil(this.destroy$),
        switchMap((user) => {
          const userId = user.id ?? user.idUtilisateur ?? user.userId;
          this.userName = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';
          this.isLoading = true;

          return forkJoin({
            loans: this.mesEmpruntsService.getLoansByUser(userId),
            reservations: this.mesEmpruntsService.getMyReservations(),
            books: this.bookService.getAllBooks(),
          });
        }),
      )
      .subscribe({
        next: ({ loans: allLoans, reservations, books }) => {
          const bookMap = new Map(
            books.map((b) => {
              const auteur = b.auteur;
              const authorStr =
                typeof auteur === 'string'
                  ? auteur
                  : auteur
                    ? `${(auteur as any).prenom ?? ''} ${(auteur as any).nom ?? ''}`.trim()
                    : '';
              return [b.isbn, { title: b.titre, author: authorStr, cover: b.couverture ?? '' }];
            }),
          );

          // Emprunts en cours
          this.loans = allLoans
            .filter((l) => l.idStatut === STATUT_ENCOURS)
            .map((l) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const due = new Date(l.dateRetourPrevue);
              const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return {
                id: l.id,
                title: bookMap.get(l.isbn)?.title ?? l.isbn,
                dueDate: this.formatDate(l.dateRetourPrevue),
                overdue: daysLeft < 0,
              };
            });

          // Réservations
          this.reservations = reservations

            .filter((r) => r.status === 'En cours' || r.status === 'Liste attente')

            .map((r) => ({
              id: r.id,
              title: r.bookTitle,
              status: r.status,
            }));

          // Livres récemment lus (emprunts terminés, du plus récent au plus ancien)
          this.recentBooks = allLoans
            .filter((l) => l.idStatut === STATUT_TERMINE)
            .sort(
              (a, b) =>
                new Date(b.dateRetourPrevue).getTime() - new Date(a.dateRetourPrevue).getTime(),
            )
            .slice(0, 6)
            .map((l) => ({
              id: l.id,
              title: bookMap.get(l.isbn)?.title ?? l.isbn,
              author: bookMap.get(l.isbn)?.author ?? '',
              cover: bookMap.get(l.isbn)?.cover ?? '',
              readDate: this.formatDate(l.dateRetourPrevue),
            }));

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Computed ────────────────────────────────────────────────────────────

  get overdueCount(): number {
    return this.loans.filter((l) => l.overdue).length;
  }

  get hasOverdue(): boolean {
    return this.overdueCount > 0;
  }

  /** Nombre de livres lus cette année (emprunts terminés sur l'année en cours) */
  get readingGoalCurrent(): number {
    return this.recentBooks.length;
  }

  get readingGoalPercent(): number {
    if (this.readingGoalTotal === 0) return 0;
    return Math.min(100, Math.round((this.readingGoalCurrent / this.readingGoalTotal) * 100));
  }

  // ── Utilitaires ─────────────────────────────────────────────────────────

  private formatDate(isoDate: string | null | undefined): string {
    if (!isoDate) return '—';
    return new Date(isoDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

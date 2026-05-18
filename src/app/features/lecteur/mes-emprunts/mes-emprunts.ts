import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../../core/navbar/navbar';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { AbsPipe } from '../../../abs.pipe';
export interface Loan {
  id: number;
  title: string;
  borrowDate: string;
  dueDate: string;
  daysLeft: number;
  overdue: boolean;
}

export interface HistoryLoan {
  id: number;
  title: string;
  borrowDate: string;
  returnDate: string;
}
export interface Reservation {
  id: number;
  title: string;
  reservedDate: string;
  position: number;
  estimatedDate: string;
}
@Component({
  selector: 'app-mes-emprunts',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar,AbsPipe],
  templateUrl: './mes-emprunts.html',
  styleUrl: './mes-emprunts.css',
})
export class MesEmpruntsComponent implements OnInit, OnDestroy {
  activeTab: 'progress' | 'history' | 'reservations' = 'progress';
  private sub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  setTab(tab: 'progress' | 'history' | 'reservations'): void {
    this.activeTab = tab;
  }

  // ── Données mock (à remplacer par appel API) ──────────────

  inProgressLoans: Loan[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      borrowDate: '15 avr. 2026',
      dueDate: '15 mai 2026',
      daysLeft: 4,
      overdue: false,
    },
    {
      id: 2,
      title: '1984',
      borrowDate: '20 avr. 2026',
      dueDate: '20 mai 2026',
      daysLeft: 9,
      overdue: false,
    },
    {
      id: 3,
      title: 'To Kill a Mockingbird',
      borrowDate: '10 mar. 2026',
      dueDate: '10 avr. 2026',
      daysLeft: -31,
      overdue: true,
    },
  ];

  historyLoans: HistoryLoan[] = [
    { id: 4, title: 'Pride and Prejudice', borrowDate: '1 fév. 2026', returnDate: '28 fév. 2026' },
    { id: 5, title: 'Animal Farm', borrowDate: '15 jan. 2026', returnDate: '10 fév. 2026' },
    { id: 6, title: 'Brave New World', borrowDate: '20 déc. 2025', returnDate: '15 jan. 2026' },
  ];

  reservations: Reservation[] = [
    {
      id: 7,
      title: 'The Hobbit',
      reservedDate: '1 mai 2026',
      position: 2,
      estimatedDate: '20 mai 2026',
    },
    {
      id: 8,
      title: 'The Catcher in the Rye',
      reservedDate: '25 avr. 2026',
      position: 1,
      estimatedDate: '15 mai 2026',
    },
  ];

  get overdueCount(): number {
    return this.inProgressLoans.filter((l) => l.overdue).length;
  }

  getGradient(id: number): string {
    const gradients: Record<number, string> = {
      1: 'gradient-indigo',
      2: 'gradient-rose',
      3: 'gradient-emerald',
      4: 'gradient-amber',
      5: 'gradient-violet',
      6: 'gradient-lime',
      7: 'gradient-sky',
      8: 'gradient-cyan',
    };
    return gradients[id] ?? 'gradient-indigo';
  }
}

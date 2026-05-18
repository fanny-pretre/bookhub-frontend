import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../../core/navbar/navbar';
import { AuthService } from '../../../shared/services/auth.service';

interface Loan {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  dueDate: string;
  overdue: boolean;
}

interface Reservation {
  id: number;
  bookTitle: string;
  status: 'WAITING' | 'AVAILABLE';
}

interface RecentBook {
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
})
export class DashboardLecteur implements OnInit {
  userName = 'Utilisateur';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Réactif : se met à jour si l'utilisateur change
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userName = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';
      }
    });
  }

  loans: Loan[] = [
    {
      id: 1,
      bookTitle: 'Le Petit Prince',
      bookAuthor: 'Antoine de Saint-Exupéry',
      dueDate: '2026-05-20',
      overdue: true,
    },
    {
      id: 2,
      bookTitle: "L'Étranger",
      bookAuthor: 'Albert Camus',
      dueDate: '2026-05-25',
      overdue: false,
    },
    {
      id: 3,
      bookTitle: 'Les Misérables',
      bookAuthor: 'Victor Hugo',
      dueDate: '2026-06-01',
      overdue: false,
    },
  ];

  reservations: Reservation[] = [
    { id: 1, bookTitle: 'Dune', status: 'AVAILABLE' },
    { id: 2, bookTitle: 'Fondation', status: 'WAITING' },
  ];

  recentBooks: RecentBook[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      readDate: 'Avr 2026',
      cover: 'https://images.unsplash.com/photo-1763571084092-a4306456166b?w=400&q=80&auto=format',
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      readDate: 'Mar 2026',
      cover: 'https://images.unsplash.com/photo-1759910546935-cfffa7aaf1fc?w=400&q=80&auto=format',
    },
    {
      id: 3,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      readDate: 'Mar 2026',
      cover: 'https://images.unsplash.com/photo-1763768861268-cb6b54173dbf?w=400&q=80&auto=format',
    },
    {
      id: 4,
      title: 'Animal Farm',
      author: 'George Orwell',
      readDate: 'Fév 2026',
      cover: 'https://images.unsplash.com/photo-1762020284758-15535e5a40a3?w=400&q=80&auto=format',
    },
  ];

  readingGoalTotal = 24;
  readingGoalCurrent = 12;

  get overdueCount(): number {
    return this.loans.filter((l) => l.overdue).length;
  }

  get hasOverdue(): boolean {
    return this.overdueCount > 0;
  }

  get readingGoalPercent(): number {
    return Math.round((this.readingGoalCurrent / this.readingGoalTotal) * 100);
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarAdmin } from '../../../core/navbar admin/navbar-admin';
import { AuthService } from '../../../shared/services/auth.service';
import { StatistiquesService, StatsData } from '../../../shared/services/statistiques.service';

@Component({
  selector: 'app-dashboard-bibliothecaire',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarAdmin],
  templateUrl: './dashboard-bibliothecaire.html',
  styleUrl: './dashboard-bibliothecaire.css',
})
export class DashboardBibliothecaireComponent implements OnInit {
  adminName = '';
 stats: StatsData | null = null;

  get statsSafe(): StatsData {
    return this.stats!;
  }
  
  constructor(
    private authService: AuthService,
    private statsService: StatistiquesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) this.adminName = user.prenom;

    this.statsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur stats dashboard:', err),
    });
  }
}
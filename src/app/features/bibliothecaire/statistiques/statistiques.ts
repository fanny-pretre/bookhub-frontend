import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarAdmin } from '../../../core/navbar admin/navbar-admin';
import { StatistiquesService, StatsData } from '../../../shared/services/statistiques.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarAdmin],
  templateUrl: './statistiques.html',
  styleUrl: './statistiques.css',
})
export class Statistiques implements OnInit {
  stats: StatsData | null = null;
  loading = true;
  error = false;
  constructor(
    private statsService: StatistiquesService,
    private cdr: ChangeDetectorRef
  ) {}

ngOnInit() {
    this.statsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges(); // force la mise à jour
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
}

  get maxCategory(): number {
    return Math.max(...(this.stats?.categories.map((c) => c.value) ?? [1]));
  }

  get maxMonthlyLoan(): number {
    return Math.max(...(this.stats?.empruntsParMois.map((m) => m.value) ?? [1]));
  }
}
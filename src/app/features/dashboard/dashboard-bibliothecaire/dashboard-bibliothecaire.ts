import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarAdmin } from '../../../core/navbar admin/navbar-admin';
import { AuthService } from '../../../shared/services/auth.service';

interface StatCard {
  icon: string;
  value: string;
  label: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

interface QuickAccessCard {
  icon: string;
  title: string;
  description: string;
  badge: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-bibliothecaire',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarAdmin],
  templateUrl: './dashboard-bibliothecaire.html',
  styleUrl: './dashboard-bibliothecaire.css',
})
export class DashboardBibliothecaireComponent implements OnInit {
  adminName = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (user) {
      this.adminName = user.prenom;
    }
  }

  stats: StatCard[] = [
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
               <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
             </svg>`,
      value: '1 245',
      label: 'Total de livres',
      trend: 'neutral',
      color: '#ef4444',
    },
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
               <circle cx="9" cy="7" r="4"/>
               <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
               <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
             </svg>`,
      value: '342',
      label: 'Lecteurs actifs',
      trend: 'neutral',
      color: '#6366f1',
    },
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
               <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
             </svg>`,
      value: '89',
      label: 'Emprunts en cours',
      trend: 'neutral',
      color: '#f59e0b',
    },
    {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <circle cx="12" cy="12" r="10"/>
               <polyline points="12 6 12 12 16 14"/>
             </svg>`,
      value: '12',
      label: 'En retard',
      trend: 'neutral',
      color: '#ef4444',
    },
  ];

  quickAccess: QuickAccessCard[] = [
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
               <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
             </svg>`,
      title: 'Gérer le catalogue',
      description: 'Ajouter, modifier et consulter les livres',
      badge: '1 245 livres',
      route: '/bibliothecaire/catalogue',
      color: '#ef4444',
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
               <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
             </svg>`,
      title: 'Emprunts',
      description: 'Gérer les emprunts et retours',
      badge: '89 en cours',
      route: '/bibliothecaire/gestionemprunts',
      color: '#f59e0b',
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <line x1="18" y1="20" x2="18" y2="10"/>
               <line x1="12" y1="20" x2="12" y2="4"/>
               <line x1="6" y1="20" x2="6" y2="14"/>
             </svg>`,
      title: 'Statistiques',
      description: 'Analyser les données de la bibliothèque',
      badge: '342 lecteurs',
      route: '/bibliothecaire/statistiques',
      color: '#f59e0b',
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
             </svg>`,
      title: 'Modération',
      description: 'Gérer les utilisateurs et signalements',
      badge: '3 en attente',
      route: '/bibliothecaire/moderation',
      color: '#6366f1',
    },
  ];

  trendIcon(trend: 'up' | 'down' | 'neutral'): string {
    if (trend === 'up')
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>`;
    if (trend === 'down')
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                <polyline points="17 18 23 18 23 12"/>
              </svg>`;
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>`;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarAdmin } from '../../../core/navbar admin/navbar-admin';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, NavbarAdmin],
  templateUrl: './moderation.html',
  styleUrl: './moderation.css',
})
export class Moderation {

  constructor(private sanitizer: DomSanitizer) {}

  sanitize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  stats = [
    {
      title: 'Signalements',
      value: 3,
      color: 'orange',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
               <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
             </svg>`,
    },
    {
      title: 'Utilisateurs actifs',
      value: 342,
      color: 'blue',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
               <circle cx="9" cy="7" r="4"/>
               <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
               <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
             </svg>`,
    },
    {
      title: 'Suspendus',
      value: 2,
      color: 'red',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
               <circle cx="9" cy="7" r="4"/>
               <line x1="17" y1="8" x2="23" y2="14"/>
               <line x1="23" y1="8" x2="17" y2="14"/>
             </svg>`,
    },
    {
      title: 'Actions résolues',
      value: 24,
      color: 'green',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
               <polyline points="22 4 12 14.01 9 11.01"/>
             </svg>`,
    },
  ];

  reports = [
    {
      type: 'Utilisateur',
      title: 'Thomas Leroy',
      reason: 'Retards répétés',
      date: '2026-05-10',
    },
    {
      type: 'Contenu',
      title: 'Commentaire inapproprié',
      reason: 'Langage offensant',
      date: '2026-05-09',
    },
  ];

  users = [
    {
      initials: 'AB',
      name: 'Alice Bernard',
      email: 'alice.bernard@email.com',
      date: '2026-05-11',
    },
    {
      initials: 'MD',
      name: 'Marc Dubois',
      email: 'marc.dubois@email.com',
      date: '2026-05-10',
    },
  ];

  shortcuts = [
    {
      title: 'Gérer les utilisateurs',
      desc: 'Voir tous les utilisateurs',
      color: 'blue',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
               <circle cx="9" cy="7" r="4"/>
               <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
               <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
             </svg>`,
    },
    {
      title: 'Historique des signalements',
      desc: '24 traités ce mois',
      color: 'orange',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
               <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
             </svg>`,
    },
    {
      title: 'Paramètres de modération',
      desc: 'Configurer les règles',
      color: 'purple',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <circle cx="12" cy="12" r="10"/>
               <line x1="12" y1="8" x2="12" y2="12"/>
               <line x1="12" y1="16" x2="12.01" y2="16"/>
             </svg>`,
    },
  ];
}
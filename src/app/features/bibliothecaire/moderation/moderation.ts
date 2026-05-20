import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarAdmin } from '../../../core/navbar admin/navbar-admin';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, NavbarAdmin],
  templateUrl: './moderation.html',
  styleUrl: './moderation.css',
})
export class Moderation {
  stats = [
    {
      title: 'Signalements',
      value: 3,
      icon: '⚠️',
      color: 'orange',
    },
    {
      title: 'Utilisateurs actifs',
      value: 342,
      icon: '👥',
      color: 'blue',
    },
    {
      title: 'Suspendus',
      value: 2,
      icon: '⛔',
      color: 'red',
    },
    {
      title: 'Actions résolues',
      value: 24,
      icon: '✅',
      color: 'green',
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
}

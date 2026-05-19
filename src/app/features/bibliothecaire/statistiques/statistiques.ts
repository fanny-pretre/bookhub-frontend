import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarAdmin } from '../../../core/navbar admin/navbar-admin';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarAdmin],
  templateUrl: './statistiques.html',
  styleUrl: './statistiques.css',
})
export class Statistiques {
  stats = [
    {
      title: 'Total de livres',
      value: '1,245',
      extra: '+12 ce mois',
      icon: '📘',
      gradient: 'from-pink-400 to-orange-500',
    },
    {
      title: 'Lecteurs actifs',
      value: '342',
      extra: '+28 ce mois',
      icon: '👥',
      gradient: 'from-blue-400 to-indigo-900',
    },
    {
      title: 'Emprunts en cours',
      value: '89',
      extra: '14 retours aujourd’hui',
      icon: '📖',
      gradient: 'from-orange-500 to-yellow-400',
    },
    {
      title: 'Emprunts en retard',
      value: '12',
      extra: 'À relancer',
      icon: '⚠️',
      gradient: 'from-yellow-300 to-blue-300',
    },
  ];

  monthlyLoans = [
    { month: 'Janvier', value: 85 },
    { month: 'Février', value: 92 },
    { month: 'Mars', value: 78 },
    { month: 'Avril', value: 95 },
    { month: 'Mai', value: 89 },
  ];

  categories = [
    { name: 'Fiction', value: 458 },
    { name: 'Science-Fiction', value: 342 },
    { name: 'Romance', value: 287 },
    { name: 'Fantasy', value: 213 },
    { name: 'Biographie', value: 156 },
  ];

  getWidth(value: number) {
    return `${value / 5}%`;
  }
}

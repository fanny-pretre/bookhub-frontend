import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import { DashboardLecteur } from './features/dashboard/dashboard-lecteur/dashboard-lecteur';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookDetailComponent } from './features/books/book-detail/book-detail.component';
import { MesEmpruntsComponent } from './features/lecteur/mes-emprunts/mes-emprunts';
import { BookAdminComponent } from './features/admin/book-admin/book-admin.component';
import { ProfileComponent } from './features/lecteur/profil-lecteur/profil-lecteur';
import { DashboardBibliothecaireComponent } from './features/dashboard/dashboard-bibliothecaire/dashboard-bibliothecaire';
import { ReservationsValidation } from './features/bibliothecaire/reservations-validation/reservations-validation';
import { Statistiques } from './features/bibliothecaire/statistiques/statistiques';
import { Moderation } from './features/bibliothecaire/moderation/moderation';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirection racine
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },

  // Routes publiques
  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: SigninComponent },

  // Routes lecteur aussi accessibles aux admins
  {
    path: 'lecteur',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    data: { roles: ['USER', 'ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardLecteur },
      { path: 'profile', component: ProfileComponent },
      { path: 'mes-emprunts', component: MesEmpruntsComponent },
      { path: 'books', component: BookListComponent },
      { path: 'books/:isbn', component: BookDetailComponent },
    ],
  },

  //Routes bibliothécaires
  {
    path: 'bibliothecaire',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    data: { roles: ['BIBLIOTHECAIRE', 'ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardBibliothecaireComponent },
      { path: 'gestionemprunts', component: ReservationsValidation },
      { path: 'statistiques', component: Statistiques },
      { path: 'moderation', component: Moderation },
      { path: 'catalogue', component: BookAdminComponent },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'connexion' },
];

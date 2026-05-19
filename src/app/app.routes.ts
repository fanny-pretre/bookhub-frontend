import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import { DashboardLecteur } from './features/dashboard/dashboard-lecteur/dashboard-lecteur';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookDetailComponent } from './features/books/book-detail/book-detail.component';
import { MesEmpruntsComponent } from './features/lecteur/mes-emprunts/mes-emprunts';
import { BookAdminComponent } from './features/admin/book-admin/book-admin.component';
import { BookFormComponent } from './features/books/book-form/book-form.component';
import { ProfileComponent } from './features/lecteur/profil-lecteur/profil-lecteur';
import { ReservationsValidation } from './features/bibliothecaire/reservations-validation/reservations-validation';

export const routes: Routes = [
  // Redirection racine
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },

  // Auth
  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: SigninComponent },

  // Espace lecteur
  { path: 'dashboard-lecteur', component: DashboardLecteur },
  { path: 'profile', component: ProfileComponent },
  { path: 'mes-emprunts', component: MesEmpruntsComponent },

  // Catalogue
  { path: 'books', component: BookListComponent },
  { path: 'books/:isbn', component: BookDetailComponent },

  // Administration, les routes spécifiques avant le paramètre dynamique
  { path: 'admin/books', component: BookAdminComponent },

  { path: 'admin/books/new', component: BookFormComponent },
  { path: 'admin/books/:isbn/edit', component: BookFormComponent },

  { path: '', redirectTo: 'connexion', pathMatch: 'full' },

  { path: 'reservations-validation', component: ReservationsValidation, },
  // Wildcard en dernier, capture tout ce qui ne correspond à aucune route
  { path: '**', redirectTo: 'connexion' },
];

import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import {DashboardLecteur} from './features/dashboard/dashboard-lecteur/dashboard-lecteur';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookDetailComponent } from './features/books/book-detail/book-detail.component';
import { ProfileComponent } from './features/lecteur/profil-lecteur/profil-lecteur';
import { MesEmpruntsComponent } from './features/lecteur/mes-emprunts/mes-emprunts';

export const routes: Routes = [
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },

  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: SigninComponent },

  { path: 'dashboard-lecteur', component: DashboardLecteur },

  { path: 'profile', component: ProfileComponent },

  { path: 'books', component: BookListComponent },
  { path: 'books/:isbn', component: BookDetailComponent },

  { path: 'mes-emprunts', component: MesEmpruntsComponent },

  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
];

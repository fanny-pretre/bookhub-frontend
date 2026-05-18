import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import {DashboardLecteur} from './features/dashboard/dashboard-lecteur/dashboard-lecteur';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookDetailComponent } from './features/books/book-detail/book-detail.component';
import { ProfileComponent } from './features/profil-lecteur/profil-lecteur';

export const routes: Routes = [
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },

  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: SigninComponent },

  { path: 'dashboard-lecteur', component: DashboardLecteur },

  { path: 'profile', component: ProfileComponent },

  { path: '**', redirectTo: 'connexion' },
  { path: 'books', component: BookListComponent },
  { path: 'books/:isbn', component: BookDetailComponent },

  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
];

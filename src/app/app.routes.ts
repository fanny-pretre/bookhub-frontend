import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import {DashboardLecteur} from './features/dashboard/dashboard-lecteur/dashboard-lecteur';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookDetailComponent } from './features/books/book-detail/book-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard-lecteur', pathMatch: 'full' },

  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: SigninComponent },

  { path: 'dashboard-lecteur', component: DashboardLecteur },

  { path: 'books', component: BookListComponent },
  { path: 'books/:isbn', component: BookDetailComponent },

  { path: '**', redirectTo: 'dashboard-lecteur' },
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
];

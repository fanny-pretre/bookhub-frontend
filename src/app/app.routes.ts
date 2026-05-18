import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import {DashboardLecteur} from './features/dashboard/dashboard-lecteur/dashboard-lecteur';

export const routes: Routes = [
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },

  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: SigninComponent },

  { path: 'dashboard-lecteur', component: DashboardLecteur },

  { path: '**', redirectTo: 'connexion' },
];

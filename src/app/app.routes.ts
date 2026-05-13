import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import {DashboardLecteur} from './features/dashboard/dashboard-lecteur/dashboard-lecteur';

export const routes: Routes = [
  {
    path: 'connexion',
    component: LoginComponent,
  },
  // Redirige la racine vers /inscription automatiquement
  {
    path: '',
    redirectTo: 'inscription',
    pathMatch: 'full',
  },
  {
    path: 'inscription',
    component: SigninComponent,
  },
  // Toute URL inconnue redirige aussi vers /inscription
  {
    path: '**', redirectTo: 'inscription'
  },
  {
    path: '',
    redirectTo: 'dashboard-lecteur',
    pathMatch: 'full',
  },
  {
    path: 'dashboard-lecteur',
    component: DashboardLecteur,
  },
];

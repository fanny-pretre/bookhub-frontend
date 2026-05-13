import { Routes } from '@angular/router';
import {DashboardLecteur} from './features/dashboard/dashboard-lecteur/dashboard-lecteur';

export const routes: Routes = [
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  {
    path: 'connexion',
    component: LoginComponent,
  },

  {
    path: 'inscription',
    component: SigninComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}

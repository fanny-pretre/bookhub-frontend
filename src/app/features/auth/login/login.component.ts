import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;
  darkMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mdp: ['', [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('mdp')!;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        const data = response.data;

        this.authService.setToken(data.token);
        this.authService.setUser({
          prenom: data.prenom,
          nom: data.nom,
          role: data.role,
        });

        this.router.navigate(['/dashboard-lecteur']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Email ou mot de passe incorrect';
      },
    });
  }
}

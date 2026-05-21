import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../shared/services/auth.service';

import { passwordStrengthValidator } from '../../../shared/validators/password.validator';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  registerForm: FormGroup;

  successMessage = '';
  errorMessage = '';

  isLoading = false;

  showPassword = false;
  darkMode = false; // Toggle dark mode

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {

    this.registerForm = this.fb.group({
      // Chaque entrée : [valeur initiale, [liste des validateurs]]
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      // Validators.email vérifie le format de l'email côté client
      email: ['', [Validators.required, Validators.email]],
      // passwordStrengthValidator() est notre validateur custom (12 car., maj, chiffre, etc.)
      password: ['', [Validators.required, passwordStrengthValidator()]],
    });
  }

  get firstname() {
    return this.registerForm.get('firstname')!;
  }
  get lastname() {
    return this.registerForm.get('lastname')!;
  }
  get email() {
    return this.registerForm.get('email')!;
  }
  get password() {
    return this.registerForm.get('password')!;
  }

  getPasswordStrength(): { percent: number; level: string; label: string } {
    const val = this.password.value ?? '';
    if (val.length === 0) return { percent: 0, level: '', label: '' };
    if (val.length < 6) return { percent: 33, level: 'weak', label: 'Faible' };
    if (val.length < 10) return { percent: 66, level: 'medium', label: 'Bon' };
    return { percent: 100, level: 'strong', label: 'Fort' };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      nom: this.registerForm.value.lastname,
      prenom: this.registerForm.value.firstname,
      email: this.registerForm.value.email,
      mdp: this.registerForm.value.password,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/connexion']);
      },
      error: (err) => {
        this.isLoading = false;

        this.errorMessage = err?.error?.message || "Une erreur est survenue lors de l'inscription";

        this.cdr.detectChanges();
      },
    });
  }
}

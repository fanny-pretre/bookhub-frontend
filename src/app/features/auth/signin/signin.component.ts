import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Notre service qui va appeler l'API backend
import { AuthService } from '../../../shared/services/auth.service';

// Notre validateur personnalisé pour la politique de mot de passe
import { passwordStrengthValidator } from '../../../shared/validators/password.validator';

@Component({
  selector: 'app-signin',
  standalone: true,
  // On déclare tous les modules utilisés dans le template de ce composant
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  // Le FormGroup représente l'ensemble du formulaire
  registerForm: FormGroup;

  // Messages affichés à l'utilisateur selon le résultat de la requête
  successMessage = '';
  errorMessage = '';

  // Booléen pour désactiver le bouton pendant l'envoi (évite les doubles soumissions)
  isLoading = false;

  showPassword = false;
  darkMode = false; // Toggle dark mode

  constructor(
    // FormBuilder est un service Angular qui simplifie la création de FormGroup/FormControl
    private fb: FormBuilder,
    // AuthService est notre service maison pour les appels API d'authentification
    private authService: AuthService,
    // Router est le service Angular de navigation (importé depuis @angular/router)
    private router: Router,
  ) {
    // On initialise le formulaire avec ses champs et leurs validateurs
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

  // Getters : raccourcis pour accéder aux contrôles dans le template sans répéter
  // registerForm.get('firstname') à chaque fois
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

    this.authService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        this.authService.setUser(response.data?.user);
        this.authService.setToken(response.data?.token);
        this.router.navigate(['/dashboard-lecteur']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "Une erreur est survenue lors de l'inscription";
      },
    });
  }
}

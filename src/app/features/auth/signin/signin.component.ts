import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Notre service qui va appeler l'API backend
import { AuthService } from '../../../core/services/auth.service';

// Notre validateur personnalisé pour la politique de mot de passe
import { passwordStrengthValidator } from '../../../core/validators/password.validator';

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
    // Si le formulaire est invalide, on affiche les erreurs sans envoyer la requête
    // markAllAsTouched() déclenche l'affichage des messages d'erreur sur tous les champs
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // On passe en mode chargement et on remet les messages à zéro
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // On envoie les données du formulaire au backend via notre service
    this.authService.register(this.registerForm.value).subscribe({
      // Cas succès : le backend a répondu avec un statut 2xx
      next: (response) => {
        this.isLoading = false;
        // On affiche le message retourné par le back, ou un message par défaut
        this.successMessage = response.message ?? 'Compte créé avec succès !';
        // Après 2 secondes, on redirige vers la page de connexion
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      // Cas erreur : le backend a répondu avec un statut 4xx ou 5xx
      error: (err) => {
        this.isLoading = false;
        // err.error contient le corps de la réponse d'erreur du backend (ex: { error: "..." })
        this.errorMessage = err.error?.error ?? 'Une erreur est survenue. Réessaie.';
      },
    });
  }
}

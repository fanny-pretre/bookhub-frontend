import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Navbar } from '../../../core/navbar/navbar';
import { AuthService } from '../../../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import {
  ProfilService,
  UpdateMdpPayload,
  UpdateProfilPayload,
} from '../../../shared/services/profil-lecteur.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profil-lecteur',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, ReactiveFormsModule],
  templateUrl: './profil-lecteur.html',
  styleUrl: './profil-lecteur.css',
})
export class ProfileComponent implements OnInit {
  user: any = null;
  userName = '';
  editingInfo = false;
  editingPassword = false;

  successMessage = '';
  errorMessage = '';
  isLoading = false;

  infoForm!: FormGroup;
  passwordForm!: FormGroup;

  private sub!: Subscription;

  constructor(
    private authService: AuthService,
    private profilService: ProfilService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.userName = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim();
        this.initForms();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private initForms(): void {
    this.infoForm = this.fb.group({
      prenom: [this.user.prenom ?? '', [Validators.required]],
      nom: [this.user.nom ?? '', [Validators.required]],
      email: [this.user.email ?? '', [Validators.required, Validators.email]],
      telephone: [this.user.telephone ?? ''],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  // ── Infos ────────────────────────────────────────────────

  toggleEditInfo(): void {
    this.editingInfo = !this.editingInfo;
    this.editingPassword = false;
    this.clearMessages();
  }

  submitInfo(): void {
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const payload: UpdateProfilPayload = this.infoForm.value;

    this.profilService.updateProfil(this.user.id, payload).subscribe({
      next: () => {
        const updatedUser = { ...this.user, ...payload };
        this.authService.setUser(updatedUser);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/lecteur/profile']);
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message ?? 'Erreur lors de la mise à jour.';
      },
    });
  }

  // ── Mot de passe ─────────────────────────────────────────

  toggleEditPassword(): void {
    this.editingPassword = !this.editingPassword;
    this.editingInfo = false;
    this.clearMessages();
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const payload: UpdateMdpPayload = this.passwordForm.value;

    this.profilService.updateMotDePasse(this.user.id, payload).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.isLoading = false;
        this.successMessage = 'Mot de passe mis à jour avec succès.';
        this.editingPassword = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message ?? 'Erreur lors de la mise à jour.';
      },
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { UtilisateurService } from '../../../shared/services/utilisateur.service';
import { Utilisateur, RegisterDto } from '../../../shared/models/utilisateur.model';
import { NavbarAdmin } from '../../../core/navbar admin/navbar-admin';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarAdmin],
  templateUrl: './user-admin.html',
  styleUrl: './user-admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAdmin implements OnInit {
  users: Utilisateur[] = [];
  filteredUsers: Utilisateur[] = [];

  isLoading = true;
  isSaving = false;
  isDeleting = false;

  errorMessage = '';
  successMessage = '';
  searchQuery = '';

  showModal = false;
  showDeleteModal = false;

  userToDelete: Utilisateur | null = null;

  userForm: FormGroup;

  constructor(
    private utilisateurService: UtilisateurService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mdp: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.utilisateurService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.updateFilteredUsers();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateFilteredUsers(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(
      (user) =>
        user.nom?.toLowerCase().includes(query) ||
        user.prenom?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.telephone?.toLowerCase().includes(query),
    );
  }

  openCreateModal(): void {
    this.userForm.reset();
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isSaving = false;
    this.errorMessage = '';
    this.userForm.reset();
  }

  onSubmit(): void {
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) return;

    this.isSaving = true;
    this.errorMessage = '';

    const payload: RegisterDto = this.userForm.value;

    this.utilisateurService.createUser(payload).subscribe({
      next: () => {
        this.showSuccess('Utilisateur créé avec succès');
        this.closeModal();
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Erreur lors de la création';
        this.isSaving = false;
        this.cdr.detectChanges();
      },
    });
  }

  openDeleteModal(user: Utilisateur): void {
    console.log('Utilisateur à supprimer :', user);

    this.userToDelete = user;
    this.showDeleteModal = true;

    this.cdr.detectChanges();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
    this.isDeleting = false;
  }

  confirmDeleteUser(): void {
    if (!this.userToDelete) return;

    this.isDeleting = true;
    this.errorMessage = '';

    const idToDelete = this.userToDelete.id;

    this.utilisateurService.deleteUser(idToDelete).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== idToDelete);
        this.updateFilteredUsers();
        this.showSuccess('Utilisateur supprimé avec succès');
        this.closeDeleteModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Erreur lors de la suppression';
        this.isDeleting = false;
        this.cdr.detectChanges();
      },
    });
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  get f() {
    return this.userForm.controls;
  }
}

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

import { BookService } from '../../../shared/services/book.service';
import { AuteurService } from '../../../shared/services/auteur.service';
import { Auteur, Book, BookFormData } from '../../../shared/models/book.model';
import { NavbarAdmin } from '../../../core/navbar admin/navbar-admin';

@Component({
  selector: 'app-book-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarAdmin],
  templateUrl: './book-admin.component.html',
  styleUrl: './book-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookAdminComponent implements OnInit {
  books: Book[] = [];
  auteurs: Auteur[] = [];
  filteredBooks: Book[] = [];

  isLoading = true;

  errorMessage = '';
  successMessage = '';
  searchQuery = '';

  showModal = false;
  isEditMode = false;
  editingIsbn = '';
  isSaving = false;

  showAuthorModal = false;
  isSavingAuthor = false;

  bookForm: FormGroup;
  authorForm: FormGroup;

  categories = [
    'Roman',
    'Fantasy',
    'Science-fiction',
    'Policier',
    'Classique',
    'Jeunesse',
    'Philosophie',
    'Aventure',
    'Historique',
  ];

  constructor(
    private bookService: BookService,
    private auteurService: AuteurService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.bookForm = this.fb.group({
      titre: ['', Validators.required],
      isbn: ['', Validators.required],
      auteurId: [null, Validators.required],
      description: ['', Validators.required],
      couverture: [''],
      categorie: ['', Validators.required],
      disponibilite: [true],
    });

    this.authorForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBooks();
      this.loadAuteurs();
    }
  }

  // ---------------- BOOKS ----------------

  loadBooks(): void {
    this.isLoading = true;

    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.updateFilteredBooks();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des livres';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateFilteredBooks(): void {
    const query = this.searchQuery.trim().toLowerCase();

    this.filteredBooks = !query
      ? [...this.books]
      : this.books.filter(
          (book) =>
            book.titre?.toLowerCase().includes(query) ||
            book.isbn?.toLowerCase().includes(query) ||
            book.auteur?.nom?.toLowerCase().includes(query) ||
            book.auteur?.prenom?.toLowerCase().includes(query),
        );
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingIsbn = '';

    this.bookForm.reset({ disponibilite: true });
    this.bookForm.get('isbn')?.enable();

    this.showModal = true;
  }

  openEditModal(book: Book): void {
    this.isEditMode = true;
    this.editingIsbn = book.isbn;

    this.bookForm.patchValue({
      titre: book.titre,
      isbn: book.isbn,
      auteurId: book.auteur?.id,
      description: book.description,
      couverture: book.couverture,
      categorie: book.categories?.[0]?.typeCategorie ?? '',
      disponibilite: book.disponibilite,
    });

    this.bookForm.get('isbn')?.disable();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.bookForm.get('isbn')?.enable();
    this.isSaving = false;
  }

  onSubmit(): void {
    this.bookForm.markAllAsTouched();
    if (this.bookForm.invalid) return;

    this.isSaving = true;

    const formValue = this.bookForm.getRawValue();

    const payload: BookFormData = {
      isbn: formValue.isbn,
      titre: formValue.titre,
      description: formValue.description,
      couverture: formValue.couverture ?? '',
      disponibilite: formValue.disponibilite,
      dateAjout: new Date().toISOString().split('T')[0],

      auteur: {
        id: formValue.auteurId,
      },

      categories: [
        {
          typeCategorie: formValue.categorie,
        } as any,
      ],
    };

    const request$ = this.isEditMode
      ? this.bookService.updateBook(this.editingIsbn, payload)
      : this.bookService.createBook(payload);

    request$.subscribe({
      next: (result) => {
        if (this.isEditMode) {
          this.books = this.books.map((b) => (b.isbn === this.editingIsbn ? result : b));
          this.showSuccess('Livre modifié avec succès');
        } else {
          this.books = [result, ...this.books];
          this.showSuccess('Livre ajouté avec succès');
        }

        this.updateFilteredBooks();
        this.closeModal();
        this.cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Erreur opération livre';
        this.isSaving = false;
        this.cdr.detectChanges();
      },
    });
  }

  deleteBook(book: Book): void {
    if (!confirm(`Supprimer "${book.titre}" ?`)) return;

    this.bookService.deleteBook(book.isbn).subscribe({
      next: () => {
        this.books = this.books.filter((b) => b.isbn !== book.isbn);
        this.updateFilteredBooks();
        this.showSuccess('Livre supprimé avec succès');
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert(err.error?.message ?? 'Erreur suppression');
      },
    });
  }

  // ---------------- AUTEURS ----------------

  loadAuteurs(): void {
    this.auteurService.getAllAuteurs().subscribe({
      next: (data) => {
        this.auteurs = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur chargement auteurs';
      },
    });
  }

  openCreateAuthorModal(): void {
    this.authorForm.reset();
    this.showAuthorModal = true;
  }

  closeAuthorModal(): void {
    this.showAuthorModal = false;
    this.isSavingAuthor = false;
  }

  onSubmitAuthor(): void {
    this.authorForm.markAllAsTouched();
    if (this.authorForm.invalid) return;

    this.isSavingAuthor = true;

    const payload = this.authorForm.value;

    this.auteurService.createAuteur(payload).subscribe({
      next: (created) => {
        this.auteurs = [created, ...this.auteurs];

        this.bookForm.patchValue({
          auteurId: created.id,
        });

        this.authorForm.reset();
        this.showAuthorModal = false;
        this.isSavingAuthor = false;

        this.showSuccess('Auteur ajouté avec succès');
        this.cdr.detectChanges();
      },

      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Erreur création auteur';
        this.isSavingAuthor = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ---------------- UI ----------------

  private showSuccess(message: string): void {
    this.successMessage = message;

    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  get f() {
    return this.bookForm.controls;
  }
}

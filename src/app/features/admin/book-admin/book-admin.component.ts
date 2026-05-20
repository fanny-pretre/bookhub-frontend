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
import { Book, BookFormData } from '../../../shared/models/book.model';
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
  filteredBooks: Book[] = [];

  isLoading = true;

  errorMessage = '';
  successMessage = '';
  searchQuery = '';

  showModal = false;
  isEditMode = false;
  editingIsbn = '';
  isSaving = false;

  bookForm: FormGroup;

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
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.bookForm = this.fb.group({
      titre: ['', [Validators.required]],
      isbn: ['', [Validators.required]],
      auteurPrenom: ['', Validators.required],
      auteurNom: ['', Validators.required],
      description: ['', Validators.required],
      couverture: [''],
      categorie: ['', Validators.required],
      disponibilite: [true],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBooks();
    }
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

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

    if (!query) {
      this.filteredBooks = [...this.books];
      return;
    }

    this.filteredBooks = this.books.filter(
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

    this.bookForm.reset({
      disponibilite: true,
    });

    this.bookForm.get('isbn')?.enable();
    this.showModal = true;
  }

  openEditModal(book: Book): void {
    this.isEditMode = true;
    this.editingIsbn = book.isbn;

    this.bookForm.patchValue({
      titre: book.titre,
      isbn: book.isbn,
      auteurPrenom: book.auteur.prenom,
      auteurNom: book.auteur.nom,
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
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.bookForm.markAllAsTouched();

    if (this.bookForm.invalid) return;

    this.isSaving = true;

    const formValue = this.bookForm.getRawValue();
    const today = new Date().toISOString().split('T')[0];

    const payload: BookFormData = {
      isbn: formValue.isbn,
      titre: formValue.titre,
      description: formValue.description,
      couverture: formValue.couverture ?? '',
      disponibilite: formValue.disponibilite,
      dateAjout: new Date().toISOString().split('T')[0],

      auteur: {
        nom: formValue.auteurNom,
        prenom: formValue.auteurPrenom,
      },

      categories: [
        {
          typeCategorie: formValue.categorie,
        } as any,
      ],
    };

    if (this.isEditMode) {
      this.bookService.updateBook(this.editingIsbn, payload).subscribe({
        next: (updated) => {
          this.books = this.books.map((b) => (b.isbn === this.editingIsbn ? updated : b));

          this.updateFilteredBooks();
          this.showSuccess('Livre modifié avec succès');
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.error?.message ?? 'Erreur modification';
          this.isSaving = false;
        },
      });
    } else {
      this.bookService.createBook(payload).subscribe({
        next: (created) => {
          this.books = [created, ...this.books];
          this.updateFilteredBooks();
          this.showSuccess('Livre ajouté avec succès');
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = err.error?.message ?? 'Erreur création';
          this.isSaving = false;
        },
      });
    }
  }

  deleteBook(book: Book): void {
    const confirmed = confirm(`Supprimer "${book.titre}" ?`);
    if (!confirmed) return;

    this.bookService.deleteBook(book.isbn).subscribe({
      next: () => {
        this.books = this.books.filter((b) => b.isbn !== book.isbn);
        this.updateFilteredBooks();
        this.showSuccess('Livre supprimé avec succès');
      },
      error: (err) => {
        alert(err.error?.message ?? 'Erreur suppression');
      },
    });
  }

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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BookService } from '../../../shared/services/book.service';
import { Book, BookFormData } from '../../../shared/models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css',
})
export class BookFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  isbn: string | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.isbn = this.route.snapshot.paramMap.get('isbn');

    if (this.isbn) {
      this.isEditMode = true;
      this.loadBook(this.isbn);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      isbn: ['', Validators.required],
      description: [''],
      auteur: this.fb.group({
        prenom: ['', Validators.required],
        nom: ['', Validators.required],
      }),
      categorie: ['', Validators.required],
      couverture: ['', Validators.required],
    });
  }

  private loadBook(isbn: string): void {
    this.isLoading = true;

    this.bookService.getBookByIsbn(isbn).subscribe({
      next: (book: Book) => {
        this.form.patchValue({
          titre: book.titre,
          isbn: book.isbn,
          description: book.description,
          auteur: {
            prenom: book.auteur.prenom,
            nom: book.auteur.nom,
          },
          categorie: book.categories?.[0]?.typeCategorie ?? '',
          couverture: book.couverture,
        });

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement du livre';
        this.isLoading = false;
      },
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    // Les noms de champs doivent correspondre exactement à l'interface BookFormData
    const payload: BookFormData = {
      isbn: formValue.isbn,
      titre: formValue.titre,
      description: formValue.description,
      couverture: formValue.couverture,
      disponibilite: true,
      dateAjout: new Date().toISOString().split('T')[0],
      auteur: {
        nom: formValue.auteur.nom,
        prenom: formValue.auteur.prenom,
      },
      categories: [formValue.categorie],
    };

    const request$ = this.isEditMode
      ? this.bookService.updateBook(this.isbn!, payload)
      : this.bookService.createBook(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/admin/books']),
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Erreur lors de la sauvegarde';
      },
    });
  }
}

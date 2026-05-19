import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Book } from '../../../shared/models/book.model';
import { BookService } from '../../../shared/services/book.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './book-admin.component.html',
  styleUrl: './book-admin.component.css',
})
export class BookAdminComponent implements OnInit {
  books: Book[] = [];
  isLoading = false;
  errorMessage = '';

  searchQuery = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des livres';
        this.isLoading = false;
      },
    });
  }

  deleteBook(book: Book): void {
    const confirmed = confirm(`Supprimer "${book.titre}" ?`);
    if (!confirmed) return;

    this.bookService.deleteBook(book.isbn).subscribe({
      next: () => {
        this.books = this.books.filter((b) => b.isbn !== book.isbn);
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors de la suppression');
      },
    });
  }

  get filteredBooks(): Book[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) return this.books;

    return this.books.filter(
      (book) =>
        book.titre?.toLowerCase().includes(query) ||
        book.isbn?.toLowerCase().includes(query) ||
        book.auteur?.nom?.toLowerCase().includes(query) ||
        book.auteur?.prenom?.toLowerCase().includes(query),
    );
  }
}

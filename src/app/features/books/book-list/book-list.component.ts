import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Book, SearchParams } from '../../../shared/models/book.model';
import { BookService } from '../../../shared/services/book.service';
import { Navbar } from '../../../core/navbar/navbar';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Navbar],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  isLoading = true;
  errorMessage = '';

  // Pagination
  currentPage = 0;
  totalPages = 1;
  totalElements = 0;
  readonly pageSize = 10;

  // Filtres
  searchQuery = '';
  selectedCategory = '';
  selectedAvailability = '';
  selectedSort = 'titre,asc';

  private searchSubject = new Subject<void>();

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
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute, // ← ajout
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.currentPage = 0;
      this.loadBooks();
    });

    // Lit le query param ?search=... envoyé par la navbar
    this.route.queryParams.subscribe((params) => {
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadBooks();
    });
  }

  onSearchChange(): void {
    this.searchSubject.next();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.searchSubject.next();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const params: SearchParams = {
      page: this.currentPage,
      size: this.pageSize,
      sort: this.selectedSort,
    };

    if (this.searchQuery.trim()) params.search = this.searchQuery.trim();
    if (this.selectedCategory) params.category = this.selectedCategory;
    if (this.selectedAvailability === 'true') params.available = true;
    if (this.selectedAvailability === 'false') params.available = false;

    this.bookService.searchBooks(params).subscribe({
      next: (data) => {
        console.log(
          'totalPages:',
          data.totalPages,
          'totalElements:',
          data.totalElements,
          'size:',
          data.size,
        );
        this.books = data.content ?? [];
        this.totalPages = data.totalPages ?? 1;
        this.totalElements = data.totalElements ?? 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger le catalogue. Réessayez plus tard.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Erreur /api/books/search :', err);
      },
    });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBooks();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBooks();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    const springPage = page - 1;
    if (springPage !== this.currentPage) {
      this.currentPage = springPage;
      this.loadBooks();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get currentPageDisplay(): number {
    return this.currentPage + 1;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const range = 2;
    const start = Math.max(1, this.currentPageDisplay - range);
    const end = Math.min(this.totalPages, this.currentPageDisplay + range);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  get availableCount(): number {
    return this.books.filter((b) => b.disponibilite).length;
  }

  get unavailableCount(): number {
    return this.books.filter((b) => !b.disponibilite).length;
  }
}

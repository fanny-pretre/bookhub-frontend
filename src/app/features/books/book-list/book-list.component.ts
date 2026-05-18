import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  books: Book[] = []; // Livres de la page courante
  isLoading = true;
  errorMessage = ''; // Message affiché en cas d'erreur API

  // Pagination
  currentPage = 0; // Page courante côté Spring (0 = première page)
  totalPages = 1; // Nombre total de pages retourné par le back
  totalElements = 0; // Nombre total de livres (toutes pages)
  readonly pageSize = 20; // Fixé à 20 par le cahier des charges

  // Filtres de recherche, liés aux inputs du template
  searchQuery = ''; // Texte de recherche libre
  selectedCategory = ''; // Catégorie sélectionnée dans le select
  selectedAvailability = ''; // 'true', 'false', ou '' pour tous
  selectedSort = 'titre,asc'; // Tri par défaut : titre alphabétique

  private searchSubject = new Subject<void>();

  // Liste des catégories affichées dans le select
  // Doit correspondre aux typeCategorie en base de données
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
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.currentPage = 0;
      this.loadBooks();
    });

    // Charge les livres au démarrage du composant
    this.loadBooks();
  }

  onSearchChange(): void {
    // On émet la valeur actuelle dans le subject
    this.searchSubject.next();
  }

  // Appelé par (ngModelChange) sur les selects (catégorie, dispo, tri)
  onFilterChange(): void {
    this.currentPage = 0;
    this.searchSubject.next();
  }

  // Lance la requête GET /api/books/search avec les filtres courants
  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // On construit l'objet SearchParams avec les valeurs courantes des filtres
    const params: SearchParams = {
      page: this.currentPage,
      sort: this.selectedSort,
    };

    // On n'ajoute les filtres optionnels que s'ils ont une valeur
    if (this.searchQuery.trim()) params.search = this.searchQuery.trim();
    if (this.selectedCategory) params.category = this.selectedCategory;
    if (this.selectedAvailability === 'true') params.available = true;
    if (this.selectedAvailability === 'false') params.available = false;

    this.bookService.searchBooks(params).subscribe({
      next: (data) => {
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

  // Passe à la page précédente, le bouton est désactivé si currentPage === 0
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBooks();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Passe à la page suivante, le bouton est désactivé si on est à la dernière page
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBooks();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    // page ici est 1-based (affiché), on convertit en 0-based pour Spring
    const springPage = page - 1;
    if (springPage !== this.currentPage) {
      this.currentPage = springPage;
      this.loadBooks();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Pour l'affichage, on convertit le 0-based de Spring en 1-based pour l'UI
  get currentPageDisplay(): number {
    return this.currentPage + 1;
  }

  // Génère les numéros de pages à afficher dans la pagination
  // Affiche 2 pages de chaque côté de la page courante
  // Ex: page 5/10 -> [3, 4, 5, 6, 7]
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const range = 2;
    const start = Math.max(1, this.currentPageDisplay - range);
    const end = Math.min(this.totalPages, this.currentPageDisplay + range);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  // Nombre de livres disponibles sur la page courante
  get availableCount(): number {
    return this.books.filter((b) => b.disponibilite).length;
  }

  // Nombre de livres indisponibles sur la page courante
  get unavailableCount(): number {
    return this.books.filter((b) => !b.disponibilite).length;
  }
}

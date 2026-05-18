import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiResponse, Book } from '../../../shared/models/book.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit {
  // null au départ, le template utilise *ngIf="book" pour éviter les erreurs
  book: Book | null = null;

  isLoading = true;
  errorMessage = '';
  showToast = false; // Contrôle l'affichage du toast de confirmation d'emprunt

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient, // Pour appeler l'API
    private cdr: ChangeDetectorRef, // Pour forcer la détection des changements avec SSR
  ) {}

  ngOnInit(): void {
    // On s'abonne aux changements de paramètres d'URL
    // Ainsi si l'ISBN change (navigation entre fiches), la requête se relance automatiquement
    this.route.paramMap
      .pipe(
        // switchMap : à chaque nouvel ISBN, annule l'appel précédent et en lance un nouveau
        switchMap((params) => {
          const isbn = params.get('isbn'); // Lit le :isbn de la route /books/:isbn

          console.log('ISBN reçu:', isbn);

          // Réinitialise l'état avant chaque nouveau chargement
          this.book = null;
          this.isLoading = true;
          this.errorMessage = '';

          if (!isbn) {
            throw new Error('ISBN invalide');
          }

          // Retourne l'Observable HTTP
          return this.http.get<ApiResponse<Book>>(`http://localhost:8080/api/books/${isbn}`);
        }),
      )
      .subscribe({
        // Cas succès : on extrait le livre depuis le wrapper ApiResponse
        next: (response) => {
          console.log('BOOK RESPONSE:', response);

          this.book = response.data;
          this.isLoading = false;

          this.cdr.detectChanges(); // utile avec hydration SSR
        },

        // Cas erreur : 404 livre inexistant, ou autre erreur serveur
        error: (err) => {
          console.error(err);

          this.errorMessage = 'Erreur lors du chargement du livre';
          this.isLoading = false;

          this.cdr.detectChanges();
        },
      });
  }

  // Déclenché par le bouton "Emprunter", affiche un toast de confirmation
  handleBorrow(): void {
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }

  // Déclenché par le bouton "Réserver"
  handleReserve(): void {
    console.log('Réservation à implémenter — US-RESA-01');
  }
}

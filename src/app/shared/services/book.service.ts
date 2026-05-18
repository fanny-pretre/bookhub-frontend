import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book, BooksPage, ApiResponse, SearchParams } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  // URL de base de l'API, tous les appels books partent de là
  private apiUrl = 'http://localhost:8080/api/books';

  // HttpClient est injecté par Angular pour faire des requêtes HTTP
  constructor(private http: HttpClient) {}

  // GET /api/books
  // Récupère tous les livres sans pagination (utilisé si besoin d'une liste complète)
  getAllBooks(): Observable<Book[]> {
    return (
      this.http
        .get<ApiResponse<Book[]>>(this.apiUrl)
        // .pipe(map(...)) transforme la réponse avant de la retourner au composant
        // On extrait uniquement response.data pour ne pas exposer le wrapper ApiResponse
        .pipe(map((response) => response.data))
    );
  }

  // GET /api/books/search?page=0&size=20&sort=titre,asc&search=...&category=...&available=...
  // Récupère les livres filtrés et paginés, utilisé par la page catalogue
  searchBooks(params: SearchParams): Observable<BooksPage> {
    // HttpParams construit les query params de façon sécurisée (encodage automatique)
    // ?? 0 est l'opérateur "nullish coalescing" : utilise la valeur de gauche si non null/undefined
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0).toString()) // page courante (0-based pour Spring)
      .set('size', '20') // toujours 20 livres par page
      .set('sort', params.sort ?? 'titre,asc'); // tri par défaut : titre alphabétique

    // On n'ajoute les filtres optionnels que s'ils sont renseignés
    // pour ne pas envoyer des params vides au back
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.available !== undefined)
      httpParams = httpParams.set('available', params.available.toString());

    return this.http
      .get<ApiResponse<BooksPage>>(`${this.apiUrl}/search`, { params: httpParams })
      .pipe(map((response) => response.data));
  }
}

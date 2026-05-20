import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book, BooksPage, ApiResponse, SearchParams, BookFormData } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  // GET /api/books
  // liste complète sans pagination (admin)
  getAllBooks(): Observable<Book[]> {
    return this.http.get<ApiResponse<Book[]>>(this.apiUrl).pipe(map((response) => response.data));
  }

  // GET /api/books/search
  // liste filtrée et paginée (catalogue lecteur)
  searchBooks(params: SearchParams): Observable<BooksPage> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 10).toString())
      .set('sort', params.sort ?? 'titre,asc');

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.available !== undefined)
      httpParams = httpParams.set('available', params.available.toString());

    return this.http
      .get<ApiResponse<BooksPage>>(`${this.apiUrl}/search`, { params: httpParams })
      .pipe(map((response) => response.data));
  }

  // GET /api/books/{isbn}
  // détail d'un livre
  getBookByIsbn(isbn: string): Observable<Book> {
    return this.http
      .get<ApiResponse<Book>>(`${this.apiUrl}/${isbn}`)
      .pipe(map((response) => response.data));
  }

  // POST /api/books
  // création (bibliothécaire uniquement)
  createBook(data: BookFormData): Observable<Book> {
    return this.http
      .post<ApiResponse<Book>>(this.apiUrl, data)
      .pipe(map((response) => response.data));
  }

  // PUT /api/books/{isbn}
  // modification (bibliothécaire uniquement)
  updateBook(isbn: string, data: BookFormData): Observable<Book> {
    return this.http
      .put<ApiResponse<Book>>(`${this.apiUrl}/${isbn}`, data)
      .pipe(map((response) => response.data));
  }

  // DELETE /api/books/{isbn}
  // suppression (échoue si emprunt en cours)
  deleteBook(isbn: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${isbn}`).pipe(map(() => undefined));
  }
}

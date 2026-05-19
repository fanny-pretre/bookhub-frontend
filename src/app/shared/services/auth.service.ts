import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'token';
  private readonly API_URL = 'http://localhost:8080/api';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem(this.USER_KEY);

      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem(this.USER_KEY);
        }
      }
    }
  }

  // ───────────────────── AUTH ─────────────────────

  login(credentials: { email: string; mdp: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((response) => {
        const token = response?.data?.token;

        if (token) {
          this.setToken(token);
        }
      }),
    );
  }

  register(payload: { prenom: string; nom: string; email: string; mdp: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, payload);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  // ───────────────────── USER ─────────────────────

  setUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      if (user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.USER_KEY);
      }
    }

    this.currentUserSubject.next(user ?? null);
  }

  getUser(): any {
    return this.currentUserSubject.value;
  }

  // ───────────────────── TOKEN ─────────────────────

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ───────────────────── BACK USER ─────────────────────

  fetchAndStoreUser(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/users/${id}`).pipe(
      tap((response: any) => {
        this.setUser(response?.data);
      }),
    );
  }
}

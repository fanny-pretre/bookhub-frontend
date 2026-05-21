import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  userName = '';
  userEmail = '';
  dropdownOpen = false;
  mobileMenuOpen = false;
  searchQuery = ''; // ← lié au champ de recherche

  navItems = [
    { path: '/lecteur/dashboard', label: 'Dashboard' },
    { path: '/lecteur/mes-emprunts', label: 'Emprunts' },
    { path: '/lecteur/profile', label: 'Profil' },
  ];

  private sub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  isAdmin = false;

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userName = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';
        this.userEmail = user.email ?? '';
        this.isAdmin = user.role === 'ADMIN' || user.role === 'BIBLIOTHECAIRE';
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  /**
   * Navigue vers le catalogue en passant la recherche en query param.
   * BookListComponent lit déjà `searchQuery` via ses propres filtres,
   * il suffira d'initialiser searchQuery depuis ActivatedRoute dans book-list.
   */
  goToSearch(): void {
    const query = this.searchQuery.trim();
    this.router.navigate(['/lecteur/books'], {
      queryParams: query ? { search: query } : {},
    });
  }

  /**
   * Déclenché à chaque frappe dans le champ (keyup.enter ou blur).
   * On retire le `readonly` du template et on branche [(ngModel)].
   */
  onSearchSubmit(): void {
    this.goToSearch();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

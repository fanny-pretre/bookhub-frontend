import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar.css', // ← tu réutilises le même CSS
})
export class NavbarAdmin implements OnInit, OnDestroy {
  userName = '';
  userEmail = '';
  dropdownOpen = false;
  mobileMenuOpen = false;
  searchQuery = '';

  navItems = [
    { path: '/bibliothecaire/gestionemprunts', label: 'Emprunts' },
    { path: '/bibliothecaire/catalogue', label: 'Catalogue' },
    { path: '/bibliothecaire/statistiques', label: 'Statistiques' },
    { path: '/bibliothecaire/moderation', label: 'Modération' },
    { path: '/lecteur/dashboard', label: 'Mode Lecteur' },
  ];

  private sub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userName = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Admin';
        this.userEmail = user.email ?? '';
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

  goToSearch(): void {
    const query = this.searchQuery.trim();
    this.router.navigate(['/bibliothecaire/catalogue'], {
      queryParams: query ? { search: query } : {},
    });
  }

  onSearchSubmit(): void {
    this.goToSearch();
  }

  logout(): void {
    this.authService.logout();
  }
}

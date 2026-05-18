import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  userName = '';
  userEmail = '';
  dropdownOpen = false;
  mobileMenuOpen = false;

  navItems = [
    { path: '/dashboard-lecteur', label: 'Tableau de bord' },
    { path: '/my-loans', label: 'Mes emprunts' },
  ];

  private sub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userName = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Utilisateur';
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
  closeDropdown(): void {
    this.dropdownOpen = false;
  }
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  goToSearch(): void {
    this.router.navigate(['/catalogue']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

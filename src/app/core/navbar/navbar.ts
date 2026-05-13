import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  dropdownOpen = false;
  mobileMenuOpen = false;

  navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/my-loans', label: 'Emprunts' },
    { path: '/profile', label: 'Profil' },
  ];

  userName = 'John Doe';
  userEmail = 'john.doe@example.com';

  constructor(public router: Router) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  goToSearch() {
    this.router.navigate(['/catalogue']);
  }

  logout() {
    this.dropdownOpen = false;
    this.router.navigate(['/login']);
  }
}

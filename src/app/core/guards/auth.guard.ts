import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (!authService.isLoggedIn() || !user) {
    router.navigate(['/connexion']);
    return false;
  }

  // 2. Récupérer les rôles requis en remontant la hiérarchie de routes
  const requiredRoles: string[] = getRequiredRoles(route);

  // Pas de restriction → accès libre aux connectés
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userRole: string | undefined = user?.role;

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  // 4. Rôle insuffisant → redirection vers son propre espace
  router.navigate([authService.getHomeRouteForRole()]);
  return false;
};

/**
 * Remonte la hiérarchie de routes pour trouver le premier `data.roles` défini.
 * Permet de poser les rôles uniquement sur le parent et de les hériter dans les enfants.
 */
function getRequiredRoles(route: ActivatedRouteSnapshot): string[] {
  let current: ActivatedRouteSnapshot | null = route;
  while (current) {
    if (current.data?.['roles']?.length) {
      return current.data['roles'];
    }
    current = current.parent;
  }
  return [];
}

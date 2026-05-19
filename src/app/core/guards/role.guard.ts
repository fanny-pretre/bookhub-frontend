import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (!user) {
    router.navigate(['/connexion']);
    return false;
  }

  const roles = route.data?.['roles'] as string[] | undefined;
  const role = route.data?.['role'] as string | undefined;

  let allowed = false;

  if (roles?.length) {
    allowed = roles.includes(user.role);
  } else if (role) {
    allowed = user.role === role;
  } else {
    allowed = true;
  }

  if (!allowed) {
    sessionStorage.setItem(
      'error_message',
      'Vous n’avez pas les droits pour accéder à cette page'
    );

    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
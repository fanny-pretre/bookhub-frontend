import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('INTERCEPTOR EXECUTÉ');

  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('TOKEN:', token);

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('HEADER AJOUTÉ');
    return next(authReq);
  }

  return next(req);
};

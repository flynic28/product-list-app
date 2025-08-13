import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

const WHITELISTED_URLS = [
  '/auth/login',  // Specific login endpoint
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (WHITELISTED_URLS.find((url) => req.url.includes(url))) return next(req)
  const authService = inject(AuthenticationService)

  const accesstoken = localStorage.getItem('access_token');

  if (accesstoken) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + accesstoken),
    });

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Redirect to logout logic
          authService.logout();
        }
        return throwError(error);
      })  
    );
  } else {
    return next(req);
  }

}

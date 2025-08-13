import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BASE_URL } from './api.constants';
import { addMinutes, isPast } from 'date-fns';
import { Router } from '@angular/router';

export interface AuthRes {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private http = inject(HttpClient)
  private router = inject(Router)

  private loggedIn = signal(false);
  public readonly isLoggedIn = computed(() => {
    const expiresAt = new Date(JSON.parse(localStorage.getItem('expires_at') ?? '1'));
    /** Commenting the below as the auth session will be sustained over a page refresh */
    // return this.loggedIn() && !isPast(expiresAt)
    console.log(expiresAt)
    return !isPast(expiresAt)
  })

  login(username: string, password: string): Observable<AuthRes> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };
    return this.http.post<AuthRes>(`${BASE_URL}auth/login`, body, { headers }).pipe(
      map((res) => {
        console.log(res)
        this.setSession(res)
        return res
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.message));
      })
    )
  }

  private setSession(res: AuthRes): void {
    this.loggedIn.set(true)
    const expiresAt = addMinutes(new Date(), 60)
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }          

  logout(): void {
    this.loggedIn.set(false)
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_at");
    this.router.navigateByUrl('/login')
  }
}

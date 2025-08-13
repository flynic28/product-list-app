import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductResult } from '../models/product.model';
import { Observable, catchError, throwError } from 'rxjs';
import { BASE_URL } from './api.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient)

  searchProducts(q: string, limit: number = 30): Observable<ProductResult> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<ProductResult>(`${BASE_URL}products/search?q=${q}&limit=${limit}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error(error.message));
      })
    )
  }

}

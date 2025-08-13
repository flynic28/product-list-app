import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../models/product.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ProductItemComponent } from '../../components/product-item/product-item.component';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ProductItemComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ProductListComponent {
  productService = inject(ProductService)
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  searchControl = new FormControl('');
  
  searchControlValue = signal<string>('');
  products = signal<Product[]>([])
  isLoading = signal<boolean>(false);

  constructor() {
    this.searchControl.valueChanges.pipe(
      map((val) => {
        const value = val?.trim() ?? ''
        this.isLoading.set(true)
        this.products.set([])
        this.searchControlValue.set(value)
        const queryParams: Params = { q: val };

        this.router.navigate(
          [], 
          {
            relativeTo: this.activatedRoute,
            queryParams, 
            queryParamsHandling: 'merge',
          }
        );
        return value
      }),
      debounceTime(300),
      distinctUntilChanged(),
      filter((val) => val?.length >= 3),
      takeUntilDestroyed(),
      switchMap((val) => {
        return this.productService.searchProducts(val ?? '')
      })
    ).subscribe((res) => {
      this.products.set(res.products);
      this.isLoading.set(false);
      },
      (_error) => {
        this.isLoading.set(false)
        this.products.set([])
      })

    const initialQuery = this.activatedRoute.snapshot.queryParamMap.get('q')
    this.searchControl.setValue(initialQuery)
  }
}

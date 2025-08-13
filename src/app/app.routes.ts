import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { ProductListComponent } from './features/product-list/product-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    {
        path: 'login',
        component: LoginComponent
    }, {
        path: 'products',
        component: ProductListComponent,
        canActivate: [authGuard]
    }, 
];

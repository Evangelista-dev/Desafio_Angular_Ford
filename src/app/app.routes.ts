import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'home', 

    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];
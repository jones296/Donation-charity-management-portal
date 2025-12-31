import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DonorDashboardComponent } from './donor-dashboard/donor-dashboard.component';
import { NgoDashboardComponent } from './ngo-dashboard/ngo-dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  {
    path: 'donor/dashboard',
    component: DonorDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'DONOR' },
  },

  {
    path: 'ngo/dashboard',
    component: NgoDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'NGO' },
  },

  { path: '**', redirectTo: '' },
];

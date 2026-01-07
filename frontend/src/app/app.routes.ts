import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DonorGuard } from './guards/donor.guard';
import { NgoGuard } from './guards/ngo.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },

  // DONOR
  {
    path: 'donations',
    canActivate: [AuthGuard, DonorGuard],
    loadComponent: () =>
      import('./donations/donation-list.component').then(
        (m) => m.DonationListComponent
      ),
  },
  {
    path: 'contribute/:id',
    canActivate: [AuthGuard, DonorGuard],
    loadComponent: () =>
      import('./contribute/contribute.component').then(
        (m) => m.ContributeComponent
      ),
  },
  {
    path: 'donor/dashboard',
    canActivate: [AuthGuard, DonorGuard],
    loadComponent: () =>
      import('./donor-dashboard/donor-dashboard.component').then(
        (m) => m.DonorDashboardComponent
      ),
  },

  // NGO
  {
    path: 'ngo/dashboard',
    canActivate: [AuthGuard, NgoGuard],
    loadComponent: () =>
      import('./ngo-dashboard/ngo-dashboard.component').then(
        (m) => m.NgoDashboardComponent
      ),
  },
  {
    path: 'ngo/create-donation',
    canActivate: [AuthGuard, NgoGuard],
    loadComponent: () =>
      import('./ngo-create-donation/ngo-create-donation.component').then(
        (m) => m.NgoCreateDonationComponent
      ),
  },

  // LEADERBOARD
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./leaderboard/leaderboard.component').then(
        (m) => m.LeaderboardComponent
      ),
  },

  {
    path: '**',
    redirectTo: '',
  },
];

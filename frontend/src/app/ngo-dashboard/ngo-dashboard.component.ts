import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NgoService } from '../services/ngo.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ngo-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ngo-dashboard.component.html',
  styleUrls: ['./ngo-dashboard.component.css'],
})
export class NgoDashboardComponent implements OnInit {
  ngoName = '';
  donations: any[] = [];
  loading = true;

  stats = {
    total: 0,
    pending: 0,
    completed: 0,
  };

  constructor(
    private ngoService: NgoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!user || user.role !== 'NGO') {
      this.router.navigate(['/login']);
      return;
    }

    this.ngoName = user.name;
    this.loadDonations();
  }

  loadDonations(): void {
    this.loading = true;

    this.ngoService.getNgoDonations().subscribe({
      next: (data: any[]) => {
        this.donations = data;

        this.stats.total = data.length;
        this.stats.pending = data.filter(
          (d) => d.status === 'PENDING' || d.status === 'CONFIRMED'
        ).length;
        this.stats.completed = data.filter(
          (d) => d.status === 'COMPLETED'
        ).length;

        this.loading = false;
      },
      error: () => {
        console.error('Failed to load NGO donations');
        this.loading = false;
      },
    });
  }

  markCompleted(id: number): void {
    const ok = confirm('Mark this donation as COMPLETED?');
    if (!ok) return;

    this.ngoService.markCompleted(id).subscribe({
      next: () => {
        alert('Donation marked as COMPLETED');
        this.loadDonations();
      },
      error: () => {
        alert('Failed to update donation');
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

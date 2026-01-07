import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ContributionService } from '../services/contribution.service';
import { AuthService } from '../services/auth.service';

// Chart.js
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donor-dashboard.component.html',
  styleUrls: ['./donor-dashboard.component.css'],
})
export class DonorDashboardComponent implements OnInit {
  donorName = '';
  contributions: any[] = [];
  loading = true;

  stats = {
    total: 0,
    pending: 0, // CONFIRMED only
    completed: 0, // COMPLETED only
  };

  private chart: Chart | null = null;

  constructor(
    private contributionService: ContributionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!user || user.role !== 'DONOR') {
      this.router.navigate(['/login']);
      return;
    }

    this.donorName = user.name;
    this.loadMyContributions();
  }

  loadMyContributions(): void {
    this.loading = true;

    this.contributionService.getMyContributions().subscribe({
      next: (data: any[]) => {
        // ❗ Donor should not see EXPIRED rows
        this.contributions = data.filter((d) => d.status !== 'EXPIRED');

        this.stats.total = this.contributions.length;

        // 🟢 Green → only when NGO completed pickup
        this.stats.completed = this.contributions.filter(
          (d) => d.status === 'COMPLETED'
        ).length;

        // 🟠 Pending → CONFIRMED (awaiting pickup)
        this.stats.pending = this.contributions.filter(
          (d) => d.status === 'CONFIRMED'
        ).length;

        this.loading = false;
        setTimeout(() => this.renderChart(), 0);
      },
      error: () => {
        console.error('Failed to load contributions');
        this.loading = false;
      },
    });
  }

  renderChart(): void {
    const canvas = document.getElementById(
      'donationChart'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [
          {
            data: [this.stats.completed, this.stats.pending],
            backgroundColor: ['#2e7d32', '#ffa726'], // 🟢 🟠
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000,
        },
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

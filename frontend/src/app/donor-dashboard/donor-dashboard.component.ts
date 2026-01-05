import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ContributionService } from '../services/contribution.service';
import { AuthService } from '../services/auth.service';

// ✅ Chart.js
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
    pending: 0,
    completed: 0,
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

  // ✅ ONLY DONOR’S CONTRIBUTIONS
  loadMyContributions(): void {
    this.loading = true;

    this.contributionService.getMyContributions().subscribe({
      next: (data: any[]) => {
        this.contributions = data;

        this.stats.total = data.length;
        this.stats.completed = data.filter(
          (d) => d.status === 'COMPLETED'
        ).length;
        this.stats.pending = data.filter(
          (d) => d.status !== 'COMPLETED'
        ).length;

        this.loading = false;

        // ✅ Render chart after data loads
        setTimeout(() => this.renderChart(), 0);
      },
      error: () => {
        console.error('Failed to load contributions');
        this.loading = false;
      },
    });
  }

  // 📊 Chart.js
  renderChart(): void {
    const canvas = document.getElementById(
      'donationChart'
    ) as HTMLCanvasElement;

    if (!canvas) return;

    // Destroy old chart if exists
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Pending', 'Completed'],
        datasets: [
          {
            label: 'Contributions',
            data: [this.stats.pending, this.stats.completed],
            backgroundColor: ['#ffa726', '#66bb6a'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

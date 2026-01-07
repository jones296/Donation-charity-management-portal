import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NgoService } from '../services/ngo.service';
import { AuthService } from '../services/auth.service';

// 📊 Chart.js
import Chart from 'chart.js/auto';

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
  filteredDonations: any[] = [];
  loading = true;

  // 🔢 animated counters (EXPIRED added)
  stats = { total: 0, pending: 0, completed: 0, expired: 0 };
  animatedStats = { total: 0, pending: 0, completed: 0, expired: 0 };

  private chart: Chart | null = null;

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

        // ✅ default show ALL including EXPIRED
        this.filteredDonations = data;

        this.stats.total = data.length;

        this.stats.pending = data.filter(
          (d) => d.status === 'PENDING' || d.status === 'CONFIRMED'
        ).length;

        this.stats.completed = data.filter(
          (d) => d.status === 'COMPLETED'
        ).length;

        this.stats.expired = data.filter((d) => d.status === 'EXPIRED').length;

        this.animateCounters();
        this.loading = false;

        setTimeout(() => this.renderChart(), 0);
      },
      error: () => (this.loading = false),
    });
  }

  // ✨ Animated counter logic (EXPIRED included)
  animateCounters(): void {
    const keys: Array<'total' | 'pending' | 'completed' | 'expired'> = [
      'total',
      'pending',
      'completed',
      'expired',
    ];

    keys.forEach((key) => {
      const target = this.stats[key];
      let current = 0;
      const step = Math.max(1, Math.floor(target / 30));

      const interval = setInterval(() => {
        current += step;

        if (current >= target) {
          current = target;
          clearInterval(interval);
        }

        this.animatedStats[key] = current;
      }, 20);
    });
  }

  // 📊 Chart with drill-down (EXPIRED added)
  renderChart(): void {
    const canvas = document.getElementById('ngoChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Pending / Confirmed', 'Completed', 'Expired'],
        datasets: [
          {
            data: [
              this.stats.pending,
              this.stats.completed,
              this.stats.expired,
            ],
            backgroundColor: ['#38bdf8', '#22c55e', '#ef4444'],
            hoverOffset: 12,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '65%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 900,
          easing: 'easeOutQuart',
        },
        onClick: (_, elements) => {
          if (!elements.length) return;
          const index = elements[0].index;

          if (index === 0) {
            this.filteredDonations = this.donations.filter(
              (d) => d.status === 'PENDING' || d.status === 'CONFIRMED'
            );
          }

          if (index === 1) {
            this.filteredDonations = this.donations.filter(
              (d) => d.status === 'COMPLETED'
            );
          }

          if (index === 2) {
            this.filteredDonations = this.donations.filter(
              (d) => d.status === 'EXPIRED'
            );
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#0f172a', font: { size: 13, weight: 'bold' } },
          },
        },
      },
    });
  }

  markCompleted(id: number): void {
    if (!confirm('Mark this donation as COMPLETED?')) return;
    this.ngoService.markCompleted(id).subscribe(() => this.loadDonations());
  }

  createDonation(): void {
    this.router.navigate(['/ngo/create-donation']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ContributionService } from '../services/contribution.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-contribute',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.css'],
})
export class ContributeComponent implements OnInit {
  donationId!: number;
  quantity: number | null = null;
  pickupDateTime = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contributionService: ContributionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 🔐 Login check
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      alert('Invalid donation');
      this.router.navigate(['/donations']);
      return;
    }

    this.donationId = Number(idParam);
  }

  submitContribution(): void {
    // ❌ Basic validation
    if (!this.quantity || this.quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (!this.pickupDateTime) {
      alert('Please select pickup date & time');
      return;
    }

    // ❌ Past date check (frontend safety)
    const selectedDate = new Date(this.pickupDateTime);
    if (selectedDate <= new Date()) {
      alert('Pickup date must be in the future');
      return;
    }

    this.loading = true;

    // 1️⃣ Confirm contribution (PARTIAL SUPPORT)
    this.contributionService
      .confirmContribution(this.donationId, this.quantity)
      .subscribe({
        next: () => {
          // 2️⃣ Schedule pickup (MANDATORY)
          this.contributionService
            .schedulePickup(this.donationId, this.pickupDateTime)
            .subscribe({
              next: () => {
                alert('Contribution successful & pickup scheduled!');
                this.router.navigate(['/donor/dashboard']);
              },
              error: (err) => {
                alert(err.error?.message || 'Pickup scheduling failed');
                this.loading = false;
              },
            });
        },
        error: (err) => {
          alert(err.error?.message || 'Contribution failed');
          this.loading = false;
        },
      });
  }
}

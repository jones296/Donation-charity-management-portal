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
  pickupDateTime: string = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contributionService: ContributionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
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
    if (!this.quantity || this.quantity <= 0 || !this.pickupDateTime) {
      alert('Please enter quantity and pickup date');
      return;
    }

    this.loading = true;

    // 1️⃣ Confirm contribution
    this.contributionService
      .confirmContribution(this.donationId, this.quantity)
      .subscribe({
        next: () => {
          // 2️⃣ Schedule pickup
          this.contributionService
            .schedulePickup(this.donationId, this.pickupDateTime)
            .subscribe({
              next: () => {
                alert('Contribution confirmed & pickup scheduled!');
                this.router.navigate(['/donor/dashboard']);
              },
              error: () => {
                alert('Pickup scheduling failed');
                this.loading = false;
              },
            });
        },
        error: () => {
          alert('Contribution failed');
          this.loading = false;
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DonationService, Donation } from '../services/donation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-donation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css'],
})
export class DonationListComponent implements OnInit {
  donations: Donation[] = [];
  loading = true;

  constructor(
    private donationService: DonationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  // ✅ FIXED METHOD CALL
  loadDonations(): void {
    this.loading = true;

    this.donationService.getAllDonations().subscribe({
      next: (data: Donation[]) => {
        // ✅ Ensure remaining_quantity exists (fallback for old rows)
        this.donations = data.map((d) => ({
          ...d,
          remaining_quantity: d.remaining_quantity ?? d.quantity_or_amount,
        }));

        this.loading = false;
      },
      error: () => {
        alert('Failed to load donation requests');
        this.loading = false;
      },
    });
  }

  // ✅ Navigate to contribute page
  contribute(donationId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/contribute', donationId]);
  }
}

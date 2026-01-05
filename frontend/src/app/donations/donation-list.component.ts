import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DonationService, Donation } from '../services/donation.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations() {
    this.donationService.getAllDonations().subscribe({
      next: (data) => {
        this.donations = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  contribute(id: number) {
    this.router.navigate(['/contribute', id]);
  }
}

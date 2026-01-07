import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DonationService } from '../services/donation.service';

@Component({
  selector: 'app-ngo-create-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ngo-create-donation.component.html',
  styleUrls: ['./ngo-create-donation.component.css'],
})
export class NgoCreateDonationComponent {
  donation_type = 'FOOD';
  quantity_or_amount!: number;
  location = '';
  pickup_date_time = '';
  loading = false;

  constructor(
    private donationService: DonationService,
    private router: Router
  ) {}

  submit(): void {
    if (
      !this.donation_type ||
      !this.quantity_or_amount ||
      !this.location ||
      !this.pickup_date_time
    ) {
      alert('All fields are required');
      return;
    }

    this.loading = true;

    this.donationService
      .createDonation({
        donation_type: this.donation_type,
        quantity_or_amount: this.quantity_or_amount,
        location: this.location,
        pickup_date_time: this.pickup_date_time,
      })
      .subscribe({
        next: () => {
          alert('Donation request created');
          this.router.navigate(['/ngo/dashboard']);
        },
        error: () => {
          alert('Failed to create donation');
          this.loading = false;
        },
      });
  }
}

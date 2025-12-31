import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ContributionService } from '../services/contribution.service';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './donor-dashboard.component.html',
})
export class DonorDashboardComponent implements OnInit {
  contributions: any[] = [];
  displayedColumns = ['donation_id', 'quantity', 'status', 'notes'];

  constructor(private contributionService: ContributionService) {}

  ngOnInit(): void {
    const donorId = Number(sessionStorage.getItem('userId'));

    this.contributionService.getDonorContributions(donorId).subscribe({
      next: (data) => (this.contributions = data),
      error: () => alert('Failed to load contribution history'),
    });
  }
}

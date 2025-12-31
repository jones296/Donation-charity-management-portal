import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ContributionService } from '../services/contribution.service';

@Component({
  selector: 'app-ngo-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './ngo-dashboard.component.html',
})
export class NgoDashboardComponent implements OnInit {
  contributions: any[] = [];
  displayedColumns = ['donor_id', 'donation_id', 'quantity', 'status'];

  constructor(private contributionService: ContributionService) {}

  ngOnInit(): void {
    const ngoId = Number(sessionStorage.getItem('userId'));

    this.contributionService.getNgoContributions(ngoId).subscribe({
      next: (data) => (this.contributions = data),
      error: () => alert('Failed to load NGO contributions'),
    });
  }
}

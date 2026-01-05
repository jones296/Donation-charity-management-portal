import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LeaderboardService,
  LeaderboardEntry,
} from '../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
  leaders: LeaderboardEntry[] = [];
  loading = true;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.leaderboardService.getLeaderboard().subscribe({
      next: (data: LeaderboardEntry[]) => {
        this.leaders = data;
        this.loading = false;
      },
      error: () => {
        console.error('Failed to load leaderboard');
        this.leaders = [];
        this.loading = false;
      },
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * ✅ MUST MATCH BACKEND RESPONSE
 */
export interface LeaderboardEntry {
  donor_id: number;
  donor_name: string;
  total_contributions: number;
}

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private apiUrl = 'http://localhost:3000/api/contributions/leaderboard';

  constructor(private http: HttpClient) {}

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(this.apiUrl);
  }
}

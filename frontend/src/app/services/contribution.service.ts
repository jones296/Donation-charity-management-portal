import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContributionService {
  private contributionUrl = 'http://localhost:3000/api/contributions';
  private pickupUrl = 'http://localhost:3000/api/pickups';

  constructor(private http: HttpClient) {}

  // ---------------------------
  // 1️⃣ Confirm Contribution
  // ---------------------------
  confirmContribution(donationId: number, quantity: number): Observable<any> {
    return this.http.post(this.contributionUrl, {
      donation_id: donationId,
      quantity,
    });
  }

  // ---------------------------
  // 2️⃣ Schedule Pickup (MANDATORY)
  // ---------------------------
  schedulePickup(donationId: number, pickupDateTime: string): Observable<any> {
    return this.http.post(this.pickupUrl, {
      donation_id: donationId,
      pickup_date_time: pickupDateTime,
    });
  }

  // ---------------------------
  // DONOR → My Contributions
  // ---------------------------
  getMyContributions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.contributionUrl}/my`);
  }
}

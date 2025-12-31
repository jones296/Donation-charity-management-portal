import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContributionService {
  private apiUrl = 'http://localhost:3000/api/contributions';

  constructor(private http: HttpClient) {}

  // Donor → Create contribution
  createContribution(data: {
    donor_id: number;
    donation_id: number;
    quantity_or_amount: number;
    notes?: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Donor → View contribution history
  getDonorContributions(donorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/donor/${donorId}`);
  }

  // NGO → View incoming contributions
  getNgoContributions(ngoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ngo/${ngoId}`);
  }
}

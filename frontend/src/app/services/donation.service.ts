import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * ✅ Donation model
 * remaining_quantity is OPTIONAL
 * (supports partial donations & backward compatibility)
 */
export interface Donation {
  id: number;
  donation_type: string;
  quantity_or_amount: number;

  // ✅ ADD THIS LINE (VERY IMPORTANT)
  remaining_quantity?: number;

  location: string;
  pickup_date_time: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private apiUrl = 'http://localhost:3000/api/donations';

  constructor(private http: HttpClient) {}

  // ---------------------------
  // PUBLIC → Get all donations
  // ---------------------------
  getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(this.apiUrl);
  }

  // ---------------------------
  // NGO → Create donation
  // ---------------------------
  createDonation(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}

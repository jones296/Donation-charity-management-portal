import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Donation {
  id: number;
  donation_type: string;
  quantity_or_amount: number;
  location: string;
  pickup_date_time: string;
  status: string;
  priority: string;
}

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private apiUrl = 'http://localhost:3000/api/donations';

  constructor(private http: HttpClient) {}

  getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(this.apiUrl);
  }
}

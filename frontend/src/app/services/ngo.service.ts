import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NgoService {
  private apiUrl = 'http://localhost:3000/api/donations';

  constructor(private http: HttpClient) {}

  // NGO → View own donations
  getNgoDonations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ngo`);
  }

  // NGO → Mark donation as COMPLETED
  markCompleted(donationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${donationId}/complete`, {});
  }
}

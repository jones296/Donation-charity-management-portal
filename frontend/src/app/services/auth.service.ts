import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // -------------------------
  // LOGIN
  // -------------------------
  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }

  // -------------------------
  // REGISTER
  // -------------------------
  register(data: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  // -------------------------
  // FORGOT PASSWORD (DELETE ACCOUNT)
  // -------------------------
  forgotPassword(email: string) {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, {
      email,
    });
  }

  // -------------------------
  // AUTH STORAGE
  // -------------------------
  saveAuth(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // -------------------------
  // HELPERS
  // -------------------------
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

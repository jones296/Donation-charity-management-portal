import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  // -------------------------
  // LOGIN
  // -------------------------
  login(): void {
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.saveAuth(res.token, res.user);

        if (res.user.role === 'DONOR') {
          this.router.navigate(['/donor/dashboard']);
        } else if (res.user.role === 'NGO') {
          this.router.navigate(['/ngo/dashboard']);
        }
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      },
    });
  }

  // -------------------------
  // FORGOT PASSWORD (DELETE FLOW)
  // -------------------------
  forgotPassword(): void {
    if (!this.email) {
      alert('Please enter your email first');
      return;
    }

    const confirmDelete = confirm(
      'This will remove your account. You must create a new account. Continue?'
    );

    if (!confirmDelete) return;

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        alert(res.message);
        this.router.navigate(['/register']);
      },
      error: (err) => {
        alert(err.error?.message || 'Something went wrong');
      },
    });
  }
}

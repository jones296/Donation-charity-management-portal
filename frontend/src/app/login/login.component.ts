import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ✅ Angular Material imports (REQUIRED)
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

    // ✅ Material modules
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
  errorMessage = ''; // ✅ FIXED (was missing earlier)

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.saveAuth(res.token, res.user);

        // ✅ KEEP YOUR EXISTING ROLE LOGIC
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
}

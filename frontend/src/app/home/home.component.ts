import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) {}

  donateNow() {
    if (!this.authService.isLoggedIn()) {
      // 🔒 New user → Register
      this.router.navigate(['/register']);
      return;
    }

    const role = this.authService.getUserRole();

    if (role === 'DONOR') {
      this.router.navigate(['/donations']);
    } else if (role === 'NGO') {
      this.router.navigate(['/ngo/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  role: 'DONOR' | 'NGO' | '' = '';
  error = '';

  constructor(private router: Router) {}

  login() {
    if (!this.email || !this.password || !this.role) {
      this.error = 'All fields are required';
      return;
    }

    sessionStorage.setItem('loggedIn', 'true');
    sessionStorage.setItem('role', this.role);

    if (this.role === 'DONOR') {
      this.router.navigate(['/donor/dashboard']);
    } else {
      this.router.navigate(['/ngo/dashboard']);
    }
  }
}

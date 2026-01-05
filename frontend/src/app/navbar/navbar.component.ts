import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isDonor(): boolean {
    return this.authService.getUserRole() === 'DONOR';
  }

  isNgo(): boolean {
    return this.authService.getUserRole() === 'NGO';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

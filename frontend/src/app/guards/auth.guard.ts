import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const requiredRole = route.data?.['role'];
  const userRole = sessionStorage.getItem('role');

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRole && userRole !== requiredRole) {
    alert('Access denied');
    router.navigate(['/login']);
    return false;
  }

  return true;
};

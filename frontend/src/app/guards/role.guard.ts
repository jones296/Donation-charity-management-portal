import { CanActivateFn } from '@angular/router';

export const roleGuard = (expectedRole: 'DONOR' | 'NGO'): CanActivateFn => {
  return () => {
    const role = sessionStorage.getItem('role');
    return role === expectedRole;
  };
};

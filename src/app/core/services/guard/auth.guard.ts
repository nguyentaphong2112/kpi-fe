import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

@Injectable({
  providedIn: 'any'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): any {
    if (this.authService.isAuthenticated()) {
      this.authService.startRefreshTokenTimer();
      return true;
    } else {
      this.authService.logout();
      return false;
    }
  }
}

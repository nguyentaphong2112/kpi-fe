import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';
import { SessionService } from '@core/services/session.service';
import { AppFunction } from '@core/models/app-function.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivateChild {
  isRedirectTo = true;
  data: { menuId: number };

  constructor(
    protected readonly router: Router,
    private sessionService: SessionService,
    private auth: AuthService,
  ) {
  }

  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (!this.auth.isAuthenticated()) {
        this.auth.logout().then();
        return;
      }
      if (state.url === '/home') {
        return true;
      }
      let url = '';
      if (this.sessionService.getSessionData(state.url)?.menuCode) {
        url = state.url;
      } else {
        if (this.sessionService.getSessionData(state.url.substring(0, state.url.indexOf('?')))?.menuCode) {
          url = state.url.substring(0, state.url.indexOf('?'));
        } else {
          url = state.url.substring(0, state.url.lastIndexOf('/'));
        }
      }
      const menuCode = this.sessionService.getSessionData(url)?.menuCode;
      const objFunction: AppFunction = this.sessionService.getSessionData(`FUNCTION_${menuCode}`);
      if (objFunction) {
        const currCode = localStorage.getItem('FUNCTION_CODE');
        if (currCode !== objFunction.menuCode) {
          localStorage.setItem('FUNCTION_CODE', objFunction.menuCode);
        }
        resolve(true);
      } else {
        await this.router.navigateByUrl('/');
        resolve(false);
      }
    });
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (state.url === '/home') {
      return true;
    }
    let url = '';
    if (this.sessionService.getSessionData(state.url)?.menuCode) {
      url = state.url;
    } else {
      if (this.sessionService.getSessionData(state.url.substring(0, state.url.indexOf('?')))?.menuCode) {
        url = state.url.substring(0, state.url.indexOf('?'));
      } else {
        url = state.url.substring(0, state.url.lastIndexOf('/'));
      }
    }
    const menuCode = this.sessionService.getSessionData(url)?.menuCode ?? childRoute?.data?.code;
    const objFunction: AppFunction = this.sessionService.getSessionData(`FUNCTION_${menuCode}`);
    if (objFunction) {
      const currCode = localStorage.getItem('FUNCTION_CODE');
      if (currCode !== objFunction.menuCode) {
        localStorage.setItem('FUNCTION_CODE', objFunction.menuCode);
      }
      return true;
    }
    this.router.navigateByUrl('/');
    return false;
  }
}

import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@core/services/user.service';
import { SessionService } from '@core/services/session.service';
import { Scopes, SessionKey } from '@core/utils/common-constants';
import { AppFunction } from '@core/models/app-function.interface';

@Injectable({
  providedIn: 'root',
})
export class AppInitService implements CanActivate {
  isLoaded = false;

  constructor(
    protected readonly router: Router,
    private sessionService: SessionService,
    private userService: UserService,
  ) {
  }

  parseJwtSessionState(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload)?.session_state;
  };

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const menus = this.sessionService.getSessionData(SessionKey.MENU);
        if (menus) {
          resolve(true);
          return;
        }
        this.isLoaded = true;
        let functionByUser: AppFunction[] = [];
        const arrMenu = await this.userService.getMyMenu().toPromise();
        if (arrMenu?.data) {
          functionByUser = arrMenu.data;
          const menuAll: AppFunction[] = [];
          const menu: AppFunction[] = [];
          for (const item of functionByUser) {
            this.sessionService.setSessionData(item.menuId.toString(), item);
            const objFunction: AppFunction = {
              menuCode: item?.menuCode,
              menuId: item?.menuId,
              parentId: item?.parentId,
              menuName: item?.menuName,
              menuUri: item?.menuUri,
              scopes: item?.scopes,
              view: item.scopes?.indexOf(Scopes.VIEW) > -1,
              create: item.scopes?.indexOf(Scopes.CREATE) > -1,
              edit: item.scopes?.indexOf(Scopes.EDIT) > -1,
              delete: item.scopes?.indexOf(Scopes.DELETE) > -1,
              approve: item.scopes?.indexOf(Scopes.APPROVE) > -1,
              import: item.scopes?.indexOf(Scopes.IMPORT) > -1,
              upload: item.scopes?.indexOf(Scopes.UPLOAD) > -1,
              download: item.scopes?.indexOf(Scopes.DOWNLOAD) > -1,
              adjusted: item.scopes?.indexOf(Scopes.ADJUSTED) > -1,
              correction: item.scopes?.indexOf(Scopes.CORRECTION) > -1,
              cancel: item.scopes?.indexOf(Scopes.CANCEL) > -1,
              review: item.scopes?.indexOf(Scopes.REVIEW) > -1,
            };
            this.sessionService.setSessionData(`FUNCTION_${item.menuCode}`, objFunction);
            item.subs = [];
            menuAll.push(item);
          }
          // Add subs menu to menu
          for (const item of menuAll) {
            if (item.isMenu === 'N') continue;
            if (item.parentId) {
              const parent = this.sessionService.getSessionData(item.parentId.toString());
              if (!parent) continue;
              parent.subs.push(item);
            } else {
              menu.push(item);
            }
          }
          this.addPath(menu);
          this.sessionService.setSessionData(SessionKey.MENU, menu);
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  private addPath(menu: AppFunction[], parent?: AppFunction) {
    menu.forEach(item => {
      if (parent) {
        item.parent = parent;
        item.breadCrumbs = [...parent.breadCrumbs, { url: item.menuUri, label: item.menuName }];
      } else {
        item.breadCrumbs = [{ url: item.menuUri, label: item.menuName }];
      }
      if (item.menuUri && item.menuUri !== '/') {
        this.sessionService.setSessionData(item.menuUri.toLowerCase(), item);
      }
      if (item.subs?.length > 0) {
        this.addPath(item.subs, item);
      }
    });
  }
}

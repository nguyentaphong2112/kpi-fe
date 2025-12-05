import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { BaseService } from '@core/services/base/base.service';
import { UrlConstant } from '@shared/constant/url.class';
import { MICRO_SERVICE, STORAGE_NAME } from '@core/constant/system.constants';
import { StorageService } from '@core/services/storage.service';
import { UserLogin } from '@shared/model/user-login';
import { IdleUserCheckService } from '@shared/services/idle-user-check.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private decodedAccessToken: any;
  private refreshTokenTimeout;
  readonly baseUrl = UrlConstant.API_VERSION;

  // Đăng nhập hệ thống
  public login(data: any): Observable<any> {
    this.resetRequest();
    this.requestOptions.serviceName = MICRO_SERVICE.ADMIN;
    this.requestOptions.data = data;
    this.requestOptions.hideLoading = true;
    const url = this.baseUrl + '/user/login';
    return this.post(url, this.requestOptions);
  }

  public clearData() {
    this.cleanCache();
    StorageService.clear();
    localStorage.clear();
  }

  public loginWithGuest(): Observable<any> {
    this.resetRequest();
    this.requestOptions.serviceName = MICRO_SERVICE.ADMIN;
    this.requestOptions.hideLoading = true;
    const url = this.baseUrl + '/guest/login';
    return this.post(url, this.requestOptions);
  }

  public changePassword(data: any): Observable<any> {
    this.resetRequest();
    this.requestOptions.serviceName = MICRO_SERVICE.ADMIN;
    this.requestOptions.data = data;
    const url = this.baseUrl + '/user/change-password';
    return this.post(url, this.requestOptions);
  }

  // Đăng xuất hệ thống
  public logout(notRedirectToLogin?: boolean) {
    // this.resetRequest();
    IdleUserCheckService.runTimer = false;
    this.clearData();
    this.stopRefreshTokenTimer();
    // const url = this.baseUrl + '/user/logout';
    if (!notRedirectToLogin) {
      this.router.navigate(['/login']);
    }
    // return this.post(url, this.requestOptions);
  }

  // Refresh token
  public refreshToken() {
    this.resetRequest();
    this.requestOptions.data = { token: StorageService.get(STORAGE_NAME.REFRESH_TOKEN) };
    this.requestOptions.serviceName = MICRO_SERVICE.ADMIN;
    this.requestOptions.hideLoading = true;
    const url = this.baseUrl + '/user/refresh-token';
    return this.post(url, this.requestOptions).pipe(
      tap(event => {
        if (event) {
          this.saveStorage(event);
        }
      }, error => {
        if ([401, 403].includes(error?.status)) {
          this.logout();
        }
      })
    );
  }

  //
  public isAuthenticated() {
    const accessToken = StorageService.get(STORAGE_NAME.ACCESS_TOKEN);
    if (accessToken && StorageService.get(STORAGE_NAME.USER_LOGIN)) {
      this.decodedAccessToken = jwt_decode(accessToken);
      return accessToken && (this.decodedAccessToken.exp * 1000 - new Date().getTime() > 0);
    }
  }

  // Luu thong tin sau khi login
  public saveStorage(res: any) {
    if (res && res.code == 'SUCCESS') {
      const userLogin = new UserLogin();
      userLogin.loginName = res.data.userInfo.loginName;
      userLogin.fullName = res.data.userInfo.fullName;
      userLogin.email = res.data.userInfo.email;
      userLogin.mobileNumber = res.data.userInfo.mobileNumber;
      userLogin.employeeCode = res.data.userInfo.employeeCode;
      StorageService.remove(STORAGE_NAME.USER_LOGIN);
      StorageService.remove(STORAGE_NAME.NUMBER_LOGIN_FAILED);
      StorageService.remove(STORAGE_NAME.REFRESH_TOKEN);
      StorageService.remove(STORAGE_NAME.ACCESS_TOKEN);
      StorageService.set(STORAGE_NAME.USER_LOGIN, userLogin);
      StorageService.set(STORAGE_NAME.NUMBER_LOGIN_FAILED, 0);
      StorageService.set(STORAGE_NAME.REFRESH_TOKEN, res.data.refreshToken);
      StorageService.set(STORAGE_NAME.ACCESS_TOKEN, res.data.accessToken);
      setTimeout(() => {
        this.startRefreshTokenTimer();
      }, 1000);
    }
  }

  // start timer refresh token
  startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const accessToken = StorageService.get(STORAGE_NAME.ACCESS_TOKEN);
    if (accessToken) {
      this.decodedAccessToken = jwt_decode(accessToken);
      // set a timeout to refresh the token a minute before it expires
      const expires = new Date(this.decodedAccessToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (40 * 1000);
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }
  }

  // stop timer refresh token
  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }
}

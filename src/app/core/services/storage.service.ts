import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
class StorageData {
  params?: any;
}

export class StorageService {
  public static data: StorageData;
  private static instanceName = '_AppStorage';
  private static storage = localStorage;

  /**
   * init
   */
  public static init(): void {
  }

  /**
   * isExprited
   */
  public static isExprited(): boolean {
    return false;
  }

  /**
   * clear
   */
  public static clear(): void {
    this.storage.removeItem(this.instanceName);
  }

  /**
   * storedData
   */
  public static storedData(): StorageData {
    const storedData = this.storage.getItem(this.instanceName);
    if (this.isNullOrEmpty(storedData)) {
      return null;
    }
    return CryptoService.decr(storedData);
  }

  public static isNullOrEmpty(str: any): boolean {
    return !str || (str + '').trim() === '';
  }

  /**
   * get
   */
  public static get(key: string): any {
    if (this.isExprited()) {
      return null;
    }
    const storedData = this.storedData();
    if (storedData == null) {
      return null;
    }
    return storedData[key];
  }

  /**
   * get
   */
  public static set(key: string, val: any): any {
    let storedData = this.storedData();
    if (storedData == null) {
      storedData = new StorageData();
    }
    storedData[key] = val;
    this.storage.setItem(this.instanceName, CryptoService.encr(storedData));
  }

  /**
   * get
   */
  public static remove(key: string): any {
    const storedData = this.storedData();
    if (!storedData) return;
    delete storedData[key];
    this.storage.setItem(this.instanceName, CryptoService.encr(storedData));
  }

  /**
   * setAccessToken
   */
  public static setAccessToken(accessToken) {
    return this.set('accessToken', accessToken);
  }

  /**
   * getUserLogin
   */
  public static getUserLogin(): string {
    return this.get('userLogin');
  }

  /**
   * setUserLogin
   */
  public static setUserLogin(userLogin) {
    return this.set('userLogin', userLogin);
  }

  public static getRoleLogin() {
    return this.get('roleLogin');
  }

  public static setRoleLogin(roleLogin) {
    return this.set('roleLogin', roleLogin);
  }

  /**
   * getLanguage
   */
  public static getLanguage(): any {
    return this.get('language');
  }

  /**
   * setLanguage
   */
  public static setLanguage(language: any): void {
    this.set('language', language);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseService } from '@core/services/base/base.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService extends BaseService {
  fullTextSearchEmployees(keyword: string): Observable<any> {
    const params = {
      keyword: keyword
    };
    return this.get(`${environment.backend.baseUrl}v1/employees`, { params: params });
  }

  public getAvatar(employeeId: number): Observable<any> {
    return this.get(`${environment.backend.baseUrl}v1/employees/avatar/${employeeId}`);
  }

  public getQrCode(employeeId: number, width: number, height: number): Observable<any> {
    this.resetRequest();
    this.requestOptions.data = {
      width: width,
      height: height,
    };
    return this.post(`${environment.backend.baseUrl}v1/employees/${employeeId}/qrcode`, this.requestOptions);
  }
}

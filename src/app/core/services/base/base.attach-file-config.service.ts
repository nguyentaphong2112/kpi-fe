import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AttachFileConfig } from '@app/core/models/attach-file-config.model';

@Injectable({
    providedIn: 'root'
  })
  export class AttachFileConfigService {
  
    private apiUrl = 'assets/data.json'; // Đường dẫn tới file JSON của bạn
  
    constructor(private http: HttpClient) { }
  
    // Hàm để lấy dữ liệu từ file JSON
    
  }
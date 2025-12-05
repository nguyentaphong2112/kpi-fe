import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { STORAGE_NAME } from '@core/constant/system.constants';
import {StorageService} from "@core/services/storage.service";

@Pipe({
  name: 'imageUrl'
})
export class ImagePipe implements PipeTransform {
  constructor(private http: HttpClient) {
  }

  async transform(src: string): Promise<string> {
    const token = StorageService.get(STORAGE_NAME.ACCESS_TOKEN);
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    const imageBlob = await this.http.get(src, { headers, responseType: 'blob' }).toPromise();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageBlob);
    });
  }
}

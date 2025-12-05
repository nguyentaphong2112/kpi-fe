import { Component, OnInit } from '@angular/core';
import { StorageService } from '@core/services/storage.service';
import { HTTP_STATUS_CODE, STORAGE_NAME } from '@core/constant/system.constants';
import { Router } from '@angular/router';
import { PersonalInfoService } from '@shared/services/personal-info.service';
import { Subscription } from 'rxjs';
import { UserService } from '@app/modules/admin/data-access/services/permissions/user.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']

})
export class PersonalInfoComponent implements OnInit {
  fullName = '';
  isHasAvatar = false;
  avtIsLoading = false;
  avtBase64: string | ArrayBuffer = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  subs: Subscription[] = [];
  basicInfo: any;

  constructor(private readonly router: Router,
              private personalInfoService: PersonalInfoService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.getPersonal();
  }

  getUserInfo() {
    this.fullName = StorageService.get(STORAGE_NAME.USER_LOGIN).fullName;
  }

  openPersonalInfo() {
    this.router.navigateByUrl('/hrm/personal/personal-info');
  }

  getPersonal() {
    if (StorageService.get(STORAGE_NAME.USER_LOGIN).employeeCode) {
      this.getAvatar();
      this.getBasicInfo();
    }
  }

  getAvatar() {
    this.avtIsLoading = true;
    this.subs.push(
      this.personalInfoService.getAvatar().subscribe(res => {
        if (res?.data) {
          this.isHasAvatar = true;
          this.avtBase64 = res?.data ? 'data:image/jpg;base64,' + res?.data : 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        }
        this.avtIsLoading = false;
      })
    );
  }

  getBasicInfo() {
    this.subs.push(
      this.personalInfoService.getBasicInfo().subscribe(res => {
        this.basicInfo = res?.data;
      })
    );
  }

  protected readonly StorageService = StorageService;
  protected readonly STORAGE_NAME = STORAGE_NAME;
}

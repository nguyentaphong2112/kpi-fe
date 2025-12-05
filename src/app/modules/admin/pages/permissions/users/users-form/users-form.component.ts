import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { UserService } from '@app/modules/admin/data-access/services/permissions/user.service';
import { Validators } from '@angular/forms';
import { REQUEST_TYPE } from '@shared/constant/common';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent extends BaseFormComponent<any> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;

  constructor(
    private readonly userService: UserService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = false;
    this.findOneById = (id) => this.userService.findOneById(id);
    this.createApi = (body: any) => this.userService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.userService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.key = 'userId';
  }

  preventSpace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  override initForm() {
    this.form = this.fb.group({
      loginName: [null, [Validators.required, Validators.maxLength(20)]],
      fullName: [null, [Validators.required, Validators.maxLength(255)]],
      email: [null, [Validators.maxLength(200)]],
      mobileNumber: [null, Validators.maxLength(20)],
      employeeCode: [null, Validators.maxLength(20)],
      note: [null, Validators.maxLength(500)]
    });
  }
}

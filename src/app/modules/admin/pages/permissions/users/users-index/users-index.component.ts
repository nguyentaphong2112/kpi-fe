import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Subscription } from 'rxjs';
import { BaseListComponent } from '@core/components/base-list.component';
import { UserService } from '@app/modules/admin/data-access/services/permissions/user.service';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { UsersFormComponent } from '@app/modules/admin/pages/permissions/users/users-form/users-form.component';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { BaseResponse } from '@core/models/base-response';
import { FunctionCode } from '@shared/enums/enums-constant';
import { AppFunction } from '@core/models/app-function.interface';

@Component({
  selector: 'app-users-index',
  templateUrl: './users-index.component.html',
  styleUrls: ['./users-index.component.scss']
})
export class UsersIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  form: FormGroup;
  subs: Subscription[] = [];
  functionCode = FunctionCode.SYS_USER;
  objFunctionUserRole: AppFunction;
  functionCodeUserRole = FunctionCode.SYS_USER_ROLE;
  isShowAdvSearch = false;
  isVisible = false;
  title = this.translate.instant('common.button.reset');
  valueInput = '';
  userId = null;

  constructor(injector: Injector,
              private readonly userService: UserService) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.userService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.userService.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.userService.export(body);
    this.lockApi = (id: number | string) => this.userService.lockOrUnlockById(id.toString(), UrlConstant.USERS.LOCK);
    this.unlockApi = (id: number | string) => this.userService.lockOrUnlockById(id.toString(), UrlConstant.USERS.UN_LOCK);
    this.resetPasswordApi = (id: number | string) => this.userService.lockOrUnlockById(id.toString(), UrlConstant.USERS.RESET_PASSWORD);
    this.serviceName = MICRO_SERVICE.ADMIN;
    this.formConfig = {
      title: 'admin.permissions.users.label.user',
      content: UsersFormComponent
    };
    this.key = 'userId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.objFunctionUserRole = this.sessionService.getSessionData(`FUNCTION_${this.functionCodeUserRole}`);
    this.initAction();
  }


  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null
    });
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        }),
        new ChildActionSchema({
          label: 'common.button.lock',
          icon: 'lock',
          isShow: this.objFunction?.edit,
          disabled: (evt: any) => {
            return evt.status === 'INACTIVE';
          },
          function: this.lockItem
        }),
        new ChildActionSchema({
          label: 'common.button.unlock',
          icon: 'unlock',
          isShow: this.objFunction?.edit,
          disabled: (evt: any) => {
            return evt.status === 'ACTIVE';
          },
          function: this.unlockItem
        }),
        new ChildActionSchema({
          label: 'common.button.reset',
          icon: 'redo',
          isShow: this.objFunction?.edit,
          function: (evt: any) => {
            this.openReset(evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.assignRole',
          icon: 'apartment',
          isShow: this.objFunctionUserRole?.view,
          function: (evt: any) => {
            this.openAssignRole(evt.userId);
          }
        })
      ]
    });
  }


  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
      {
        title: 'admin.permissions.users.label.loginName',
        field: 'loginName',
        thClassList: ['text-center']
      },
      {
        title: 'admin.permissions.users.label.fullName',
        thClassList: ['text-center'],
        field: 'fullName'
      },
      {
        title: 'admin.permissions.users.label.email',
        field: 'email',
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'admin.permissions.users.label.mobileNumber',
        field: 'mobileNumber',
        thClassList: ['text-center'],
        width: 120
      },
      {
        title: 'admin.permissions.users.label.employeeCode',
        field: 'employeeCode',
        thClassList: ['text-center'],
        width: 120
      },
      {
        title: 'admin.permissions.users.label.status',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.flagStatusTpl,
        thClassList: ['text-nowrap', 'text-center'],
        tdClassList: ['text-nowrap', 'text-center'],
        width: 140
      },
      {
        title: 'admin.permissions.users.label.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'admin.permissions.users.label.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'admin.permissions.users.label.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'admin.permissions.users.label.modifiedBy',
        field: 'modifiedBy',
        thClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }

  openReset(data: NzSafeAny) {
    this.isSubmitted = false;
    this.isVisible = true;
    this.userId = data[this.key];
  }

  handleCancel(): void {
    this.isVisible = false;
    this.valueInput = '';
  }

  preventSpace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  resetPassword() {
    const invalid = this.validatePassword(this.valueInput);
    if (invalid !== null) {
      this.toast.error(invalid);
      return;
    }
    this.userService.resetPass(this.userId, { password: this.valueInput }, UrlConstant.USERS.RESET_PASSWORD).subscribe((res: BaseResponse<any>) => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        // this.modal.success({
        //   nzTitle: this.translate.instant('common.notification.resetSuccess'),
        //   nzContent: this.translate.instant('common.notification.resetPassword', { data: res.data })
        // });
        this.toast.success(this.translate.instant('common.notification.resetSuccessMain'));
        this.handleCancel();
        this.search();
      }
    });
  }

  validatePassword(password: NzSafeAny) {
    const specialCharacters = /[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const lowercase = /[a-z]/;
    const uppercase = /[A-Z]/;
    const digits = /[0-9]/;
    if (password.length < 8) {
      return this.translate.instant('common.user.validate.error');
    }
    if (!lowercase.test(password) || !uppercase.test(password) || !digits.test(password) || !specialCharacters.test(password)) {
      return this.translate.instant('common.user.validate.error');
    }
    return null;
  }

  openAssignRole(userId: number) {
    this.router.navigate(['/admin/permission/user/users-role'], { queryParams: { userId } });
  }
}

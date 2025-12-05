import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { UserRoleService } from '@app/modules/admin/data-access/services/permissions/user-role.service';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { RolesService } from '@app/modules/admin/data-access/services/permissions/roles.service';
import { ScopePopupComponent } from '@app/modules/admin/pages/permissions/users/scope-popup/scope-popup.component';
import { REQUEST_TYPE } from '@shared/constant/common';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-users-role',
  templateUrl: './users-role.component.html',
  styleUrls: ['./users-role.component.scss']
})
export class UsersRoleComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  userId!: number;
  listAddRole = [];
  listRoleId = [];
  role: any;
  roleData: any;
  data: any;
  functionCode = FunctionCode.SYS_USER_ROLE;
  @ViewChild('actionScopeTmpl', { static: true }) actionScopeTpl!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly userRoleService: UserRoleService,
    private readonly categoryService: CategoriesService,
    private readonly roleService: RolesService
  ) {
    super(injector);
    this.deleteApi = (id: number | string) => this.userRoleService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.userRoleService.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.userRoleService.export(body);
    this.userId = this.route.snapshot.queryParams.userId;
    this.searchByUserId(this.userId);
    this.initList();
    this.isCustomSearch = true;
    this.serviceName = MICRO_SERVICE.ADMIN;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
  }

  initDataSelect() {
    this.roleService.getList(null, UrlConstant.ROLES.GET_LIST).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        res.data.forEach(item => {
          if (!this.listRoleId.some(id => id === item.roleId)) {
            this.listAddRole.push(item);
          }
        });
      }
    });
  }

  searchByUserId(userId: number) {
    this.userRoleService.getList(null, UrlConstant.USER_ROLES.GET_BY_USER_ID.replace('{userId}', userId.toString()))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.tableData = res.data;
          res.data.forEach(item => {
            this.listRoleId.push(item.roleId);
          });
          this.listAddRole = [];
          this.initDataSelect();
        }
      });
  }

  initList() {
    this.categoryService.getList({ isGetAttribute: true }, UrlConstant.CATEGORIES.GET_LIST_CATEGORY.replace('{categoryType}', Constant.CATEGORY.GET_ATTRIBUTES))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.data = res.data;
        }
      });
  }

  addRole($event) {
    if ($event !== null && $event !== undefined) {
      const request = {
        roleId: $event
      };
      this.userRoleService.createOrImport(request, REQUEST_TYPE.FORM_DATA, UrlConstant.USER_ROLES.GET_BY_USER_ID.replace('{userId}', this.userId.toString()))
        .subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.role = null;
            this.listAddRole = [];
            this.listRoleId = [];
            this.searchByUserId(this.userId);
          }
        });
    }
  }

  deleteRole(roleId: number) {
    this.popupService.showModalConfirmDelete(() => {
      this.userRoleService.deleteRole(UrlConstant.USER_ROLES.DELETE_BY_USER_ID.replace('{userId}', this.userId.toString()).replace('{roleId}', roleId.toString()))
        .subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.listAddRole = [];
            this.listRoleId = [];
            this.searchByUserId(this.userId);
          }
        });
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
        title: 'admin.permissions.userRoles.label.roleName',
        field: 'roleName',
        width: 200,
        thClassList: ['text-center'],
        tdClassList: ['text-center']
      },
      {
        title: 'admin.permissions.userRoles.label.scopeAuthorized',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionScopeTpl
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

  openScopeModal(id: number) {
    this.roleData = this.tableData.filter(it => it.roleId === id);
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: this.translate.instant('admin.permissions.userRoles.label.scopeAuthorized'),
      nzContent: ScopePopupComponent,
      nzComponentParams: {
        roleId: id,
        userId: this.userId,
        data: this.data,
        roleData: this.roleData
      },
      nzFooter: this.footerTpl,
      nzClassName: 'scope__modal'
    });
    this.modalRef.afterClose.subscribe((result) =>
      result?.refresh ? this.searchByUserId(this.userId) : ''
    );
  }

}

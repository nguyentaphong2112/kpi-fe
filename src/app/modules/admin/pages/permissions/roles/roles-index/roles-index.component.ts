import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { RolesService } from '@app/modules/admin/data-access/services/permissions/roles.service';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { RolesFormComponent } from '@app/modules/admin/pages/permissions/roles/roles-form/roles-form.component';
import { TreeNode } from '@shared/model/tree-node';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { RolesMenuComponent } from '@app/modules/admin/pages/permissions/roles/roles-menu/roles-menu.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { ObjectUtil } from '@core/utils/object.util';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-roles-index',
  templateUrl: './roles-index.component.html',
  styleUrls: ['./roles-index.component.scss']
})
export class RolesIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  form: FormGroup;
  subs: Subscription[] = [];
  listUsedStatus: CategoryModel[] = [];
  constant = Constant;
  listMenus!: TreeNode[];
  functionCode = FunctionCode.SYS_ROLES;
  isShowAdvSearch = false;

  constructor(
    injector: Injector,
    public fb: FormBuilder,
    private readonly roleService: RolesService
  ) {
    super(injector);
    this.initDataSelect();
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.roleService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.roleService.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.roleService.export(body);
    this.isCustomSearch = false;
    this.serviceName = MICRO_SERVICE.ADMIN;
    this.formConfig = {
      title: 'admin.permissions.roles.label.role',
      content: RolesFormComponent
    };
    this.key = 'roleId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }


  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null,
      domainLevel: null
    });
  }

  initDataSelect() {
    this.listUsedStatus = ObjectUtil.optionsToList(this.constant.RESOURCE_USED_STATUS, this.translate);
    this.roleService.getList(null, UrlConstant.ROLES.GET_TREE_ROLE).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listMenus = res.data;
      }
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
          label: 'common.button.authorized',
          icon: 'bars',
          isShow: true,
          function: (evt: any) => {
            this.openMenuModal(evt.roleId);
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
        title: 'admin.permissions.roles.label.code',
        field: 'code',
        thClassList: ['text-center']
      },
      {
        title: 'admin.permissions.roles.label.name',
        thClassList: ['text-center'],
        field: 'name'
      },
      {
        title: 'admin.permissions.roles.label.domainLevel',
        field: 'domainLevel',
        thClassList: ['text-center'],
        width: 200
      },
      {
        title: 'admin.permissions.users.label.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'admin.permissions.users.label.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 100
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

  openMenuModal(roleId: number) {
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: this.translate.instant('admin.permissions.roles.label.authorized'),
      nzContent: RolesMenuComponent,
      nzComponentParams: {
        roleId,
        listMenus: this.listMenus
      },
      nzFooter: null,
      nzClassName: 'menu__modal'
    });
    this.modalRef.afterClose.subscribe((result) =>
      result?.refresh ? this.search(this.pagination.pageNumber) : ''
    );
  }

}

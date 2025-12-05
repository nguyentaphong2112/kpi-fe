import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UserRoleService } from '@app/modules/admin/data-access/services/permissions/user-role.service';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { FormArray } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DataConfig } from '@shared/component/tree-data-picker/tree-data-picker.component';
import { REQUEST_TYPE } from '@shared/constant/common';
import { FunctionCode } from '@shared/enums/enums-constant';
import { ValidationService } from '@shared/services/validation.service';

@Component({
  selector: 'app-scope-popup',
  templateUrl: './scope-popup.component.html',
  styleUrls: ['./scope-popup.component.scss']
})
export class ScopePopupComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  roleId: number;
  userId: number;
  data = [];
  roleData: any;
  readonly FORM_ARRAY_NAME = 'scopes';
  dataConfig: DataConfig = {
    titleTree: 'common.organization.bookTree',
    titleHeader: 'common.organization.bookOrg',
    domainName: 'common.organization.bookName',
    parentName: 'common.organization.bookManagement'
  };
  urlLoadDataNode = UrlConstant.DOMAINS.LOAD_NODE;
  urlLoadChildren = UrlConstant.DOMAINS.LOAD_BY_PARENT;
  urlSearch = UrlConstant.DOMAINS.SEARCH;
  serviceName = MICRO_SERVICE.ADMIN;
  urlLoadDomainList = UrlConstant.DOMAINS.GET_LIST_DOMAIN;
  functionCode = FunctionCode.SYS_USER_ROLE;

  constructor(
    injector: Injector,
    private readonly userRoleService: UserRoleService
  ) {
    super(injector);
    this.initForm();
    this.deleteApi = (id: number | string) => this.userRoleService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.userRoleService.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.userRoleService.export(body);
    this.modalRef = injector.get(NzModalRef);

    this.isCustomSearch = true;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.patchValue();
  }


  get f() {
    return this.form.controls;
  }


  get scopes(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  getWidth() {
    if (!this.objFunction?.edit) {
      const width = 100 / this.data.length;
      return width.toString() + '%';
    } else {
      const width = 90 / this.data.length;
      return width.toString() + '%';
    }
  }


  initForm() {
    this.form = this.fb.group({
      scopes: this.fb.array([])
    });
  }

  addNewScopes() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const controlsConfig = {};
      this.data.forEach((item) => {
        controlsConfig[item.value] = [null];
      });
      const profile = this.fb.group(controlsConfig, { validators: ValidationService.atLeastOneRequiredValidator() });
      this.scopes.push(profile);
      this.isSubmitted = false;
    }
  }

  patchValue() {
    if (this.roleData[0]?.groupDomains?.length > 0) {
      this.roleData[0]?.groupDomains.forEach((domain, i) => {
        this.addNewScopes();
        domain.forEach((it) => {
          this.data.forEach((item) => {
            if (item.value === it.domainType && item.attributes.TYPE === 'LIST') {
              this.scopes.controls[i].controls[item.value].setValue(it.domains.map(a => a.domainId));
              return;
            } else if (item.value === it.domainType && item.attributes.TYPE === 'TREE') {
              this.scopes.controls[i].controls[item.value].setValue(it.domains.map(b => {
                return {
                  domainId: b.domainId,
                  name: b.domainName
                };
              }));
              return;
            }
          });
        });
      });
    } else {
      this.addNewScopes();
    }
    this.isSubmitted = false;
  }


  onDeleteScopesClick(i: number) {
    if (this.scopes.length > 1) {
      this.popupService.showModalConfirmDelete(() => {
        this.scopes.removeAt(i);
      });
    } else {
      this.popupService.showModalConfirmDelete(() => {
        this.scopes.removeAt(i);
        this.addNewScopes();
      });
    }
  }

  save() {
    this.isSubmitted = true;
    if (this.form.valid || this.scopes.length === 1) {
      const request = {
        userId: this.userId,
        roleData: [{
          groupDomains: [[]],
          roleId: this.roleId
        }]
      };
      for (let i = 0; i < this.scopes.length; i++) {
        let domainIds = [];
        let domainType = '';
        request.roleData[0].groupDomains[i] = [];
        this.data.forEach((item) => {
          domainType = item.value;
          if (item.attributes.TYPE === 'LIST') {
            domainIds = this.scopes.controls[i].controls[item.value].value;
          } else {
            domainIds = this.scopes.controls[i].controls[item.value].value?.map(itm => itm.domainId) ?? null;
          }
          request.roleData[0].groupDomains[i].push({
            domainIds,
            domainType
          });
        });
      }
      this.userRoleService.createOrImport(request, REQUEST_TYPE.DEFAULT, UrlConstant.USER_ROLES.GRANT_DOMAIN)
        .subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(
              this.translate.instant('common.notification.updateSuccess')
            );
            this.modalRef?.close({ refresh: true });
          }
        });
    }
  }

}

import { Component, Injector, OnInit } from '@angular/core';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { RolesService } from '@app/modules/admin/data-access/services/permissions/roles.service';
import { Validators } from '@angular/forms';
import { CategoryModel } from '@core/models/category-common.interface';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { REQUEST_TYPE } from '@shared/constant/common';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent extends BaseFormComponent<any> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  listDomainType: CategoryModel[] = [];
  constant = Constant;
  hideDomainValue = true;
  selectedLabel = '';
  lastEvent = null;
  urlLoadDomainValue = '';

  constructor(
    private readonly roleService: RolesService,
    private readonly categoryService: CategoriesService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = false;
    this.initDataSelect();
    this.findOneById = (id) => this.roleService.findOneById(id);
    this.createApi = (body: any) => this.roleService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.roleService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.key = 'roleId';
  }

  override initForm() {
    this.form = this.fb.group({
      code: [null, [Validators.required, Validators.maxLength(20)]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      defaultDomainType: [null],
      defaultDomainValue: [null],
      note: [null, Validators.maxLength(500)]
    });
  }

  initDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORIES.GET_LIST_CATEGORY.replace('{categoryType}', this.constant.CATEGORY.DEFAULT))
      .subscribe(res => {
        this.listDomainType = res.data;
      });
  }


  domainTypeChange($event) {
    if ($event !== null && $event !== this.lastEvent) {
      this.lastEvent = $event;
      this.hideDomainValue = false;
      this.selectedLabel = this.listDomainType.find(item => item.value === $event).name;
      this.urlLoadDomainValue = UrlConstant.DOMAINS.GET_DEFAULT_LIST_DOMAIN.replace('{type}', $event);
      this.form.controls.defaultDomainValue.setValue(null);
    } else if ($event === null) {
      this.lastEvent = null;
      this.hideDomainValue = true;
      this.form.controls.defaultDomainValue.setValue(null);
    }
  }
}

import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Validators } from '@angular/forms';
import { ResourcesService } from '@app/modules/admin/data-access/services/permissions/resources.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import {REQUEST_TYPE} from '@shared/constant/common';

@Component({
  selector: 'app-resources-form',
  templateUrl: './resources-form.component.html',
  styleUrls: ['./resources-form.component.scss']
})
export class ResourcesFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  urlLoadScope = UrlConstant.RESOURCES.GET_SCOPE;
  urlTreeResource = UrlConstant.RESOURCES.GET_TREE_RESOURCE;
  listIsMenu: CategoryModel[] = [];
  constant = Constant;

  constructor(
    private readonly service: ResourcesService,
    injector: Injector
  ) {
    super(injector);
    this.initDataSelect();
    this.isPage = false;
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: NzSafeAny) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: NzSafeAny) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.key = 'resourceId';
  }

  override initForm() {
    this.form = this.fb.group({
      resourceId: [null],
      code: [null, [Validators.required, Validators.maxLength(50)]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      parentId: [null],
      scopeIds: [null],
      icon: [null],
      url: [null],
      isMenu: ['N'],
      orderNumber: [null, [Validators.required]]
    });
  }

  initDataSelect() {
    this.listIsMenu = this.constant.LIST_CONFIRM.map(item => {
      item.label = this.translate.instant(item.label);
      return item;
    });
  }

  override beforePatchValue() {
    this.data.parentId = this.data.parentId?.toString();
  }
}

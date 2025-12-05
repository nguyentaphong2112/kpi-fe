import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { CommonUtils } from '@shared/services/common-utils.service';
import { FormArray, Validators } from '@angular/forms';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { CategoriesModel } from '@app/modules/admin/data-access/models/categories/categories.model';

@Component({
  selector: 'app-csm-form',
  templateUrl: './csm-form.component.html',
  styleUrls: ['./csm-form.component.scss']
})
export class CsmFormComponent extends BaseFormComponent<CategoriesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  constant = Constant;
  isDisabledValue = false;

  constructor(
    private readonly service: CategoriesService,
    injector: Injector
  ) {
    super(injector);
    this.initForm();
    this.findOneById = (id) => this.service.findOneById(id, `/${this.data.categoryType}`);
    this.createApi = (body: CategoriesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, `/${this.data.categoryTypeSelect.code}`);
    this.updateApi = (body: CategoriesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, `/${this.data.categoryType}`);
    this.key = 'categoryId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.setConfigAttributes(this.data.categoryTypeSelect);
  }

  initForm() {
    this.form = this.fb.group({
      categoryId: [null],
      code: [null, [Validators.maxLength(50)]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      value: [null],
      orderNumber: [null],
      listAttributes: this.fb.array([])
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  setConfigAttributes(categoryTypeSelect) {
    this.listAttributeConfig = categoryTypeSelect.listAttributes;
    this.afterPatchValue();
    this.isDisabledValue = categoryTypeSelect?.isAutoIncrease === 'Y';
    if (this.isDisabledValue && !this.data.categoryId) {
      this.f.value.reset();
    }
    this.f.value.setValidators(this.isDisabledValue ? null : [Validators.required]);
    this.f.value.updateValueAndValidity();
  }
}

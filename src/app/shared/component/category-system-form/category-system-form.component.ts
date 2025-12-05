import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { DataService } from '@shared/services/data.service';
import { UrlConstant } from '@shared/constant/url.class';
import { CategoriesService } from '@app/shared/services/categories.service';

@Component({
  selector: 'app-category-system-form',
  templateUrl: './category-system-form.component.html',
  styleUrls: ['./category-system-form.component.scss']
})
export class CategorySystemFormComponent extends BaseFormComponent<any> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  isDisabledValue = false;
  categoryTypeCode: string;
  categoryType: any;

  constructor(
    private readonly service: CategoriesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.mode = this.modeConst.ADD;
    this.initForm();
    this.createApi = (body: any) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA, `/${this.categoryTypeCode}`);
    this.key = 'categoryId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.getCategoryType();
  }

  getCategoryType() {
    if (this.categoryTypeCode) {
      const url = UrlConstant.CATEGORIES.CATEGORY_TYPE_BY_CODE.replace('{code}', this.categoryTypeCode);
      this.subscriptions.push(
        this.dataService.getData(url, this.serviceName).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.categoryType = res.data;
            this.setConfigAttributes(res.data);
          }
        })
      );
    }
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

import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { ObjectUtil } from '@core/utils/object.util';
import { CategoryTypesModel } from '@app/modules/admin/data-access/models/categories/category-types.model';
import { CategoryTypeService } from '@app/modules/admin/data-access/services/categories/category-type.service';

@Component({
  selector: 'app-cts-form',
  templateUrl: './cts-form.component.html',
  styleUrls: ['./cts-form.component.scss']
})
export class CtsFormComponent extends BaseFormComponent<CategoryTypesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  readonly FORM_ARRAY_NAME = 'attributes';
  listRequired: CategoryModel[] = [];
  listType: CategoryModel[] = [];
  constant = Constant;

  constructor(injector: Injector,
              private readonly categoryTypeService: CategoryTypeService
  ) {
    super(injector);
    this.initDataSelect();
    this.findOneById = (id) => this.categoryTypeService.findOneById(id);
    this.createApi = (body: any) => this.categoryTypeService.createOrImport(body, REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.categoryTypeService.update(body, REQUEST_TYPE.DEFAULT);
    this.key = 'categoryTypeId';
    this.isConvertFindForm = false;
  }

  override initForm() {
    this.form = this.fb.group({
      code: [null, [Validators.required, Validators.maxLength(50)]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      orderNumber: [null],
      isAutoIncrease: ['Y'],
      groupType: this.data?.groupType ?? null,
      attributes: this.fb.array([])
    });
    this.initAttributes();
  }

  patchValueInfo() {
    if (this.data) {
      this.form.patchValue({
        code: this.data.code,
        name: this.data.name,
        orderNumber: this.data.orderNumber,
        isAutoIncrease: this.data.isAutoIncrease,
        groupType: this.data.groupType,
      })

      this.data.listAttributes?.forEach((it, index) => {
        if (index > 0) {
          this.initAttributes();
        }
        this.attributes.controls[index].patchValue(it);
      });
    }
  }

  initDataSelect() {
    this.listRequired = ObjectUtil.optionsToList(this.constant.LIST_REQUIRED, this.translate);
    this.listType = ObjectUtil.optionsToList(this.constant.LIST_TYPE, this.translate);
  }

  get attributes(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  initAttributes() {
    const controlsConfig: any = {};
    controlsConfig.code = [null];
    controlsConfig.name = [null];
    controlsConfig.dataType = [null];
    controlsConfig.isRequired = [null];
    controlsConfig.urlApi = [''];
    const profile = this.fb.group(controlsConfig);
    this.attributes.push(profile);
  }

  addNewAttributes() {
    this.isSubmitted = true;
    if (this.attributes.valid) {
      this.initAttributes();
      this.isSubmitted = false;
    }
  }

  onDeleteAttributesClick(i: number) {
    if (this.attributes.length > 1) {
      this.popupService.showModalConfirmDelete(() => {
        this.attributes.removeAt(i);
      });
    } else {
      this.popupService.showModalConfirmDelete(() => {
        this.attributes.removeAt(i);
        this.initAttributes();
      });
    }
  }

  changeAttributes(index: number) {
    const keys = ['code', 'name', 'dataType', 'isRequired', 'urlApi'];
    const control = (this.attributes.at(index) as FormControl);
    const isRequired = keys.some(key => control.get(key).value);
    keys.forEach(key => {
      if (key !== 'urlApi') {
        control.get(key).setValidators(isRequired ? [Validators.required] : null);
      }
      control.get(key).updateValueAndValidity();
    })
  }

  beforeSave() {
    if (this.body.attributes?.length > 0) {
      this.body.attributes = this.body.attributes.filter(item => item.code)
    }
  }
}


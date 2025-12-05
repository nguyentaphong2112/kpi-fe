import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import {
  ConfigParameterService
} from '@app/modules/admin/data-access/services/configurations/config-parameter.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ObjectUtil } from '@core/utils/object.util';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { CustomValidators } from '@core/utils/custom-validations';

@Component({
  selector: 'app-config-form',
  templateUrl: './config-form.component.html',
  styleUrls: ['./config-form.component.scss']
})
export class ConfigFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  readonly FORM_ARRAY_NAME = 'configColumns';
  listRequired: CategoryModel[] = [];
  listType: CategoryModel[] = [];
  listPeriodType: CategoryModel[] = [];
  constant = Constant;


  constructor(injector: Injector,
              private readonly configParameterService: ConfigParameterService) {
    super(injector);
    this.findOneById = (id) => this.configParameterService.findOneById(id);
    this.createApi = (body: any) => this.configParameterService.createOrImport(body, REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.configParameterService.update(body, REQUEST_TYPE.DEFAULT);
    this.initDataSelect();
    this.isPage = false;
  }

  ngOnInit() {
    this.mode = this.modeConst.ADD;
    super.ngOnInit();
    this.patchValue();
  }

  patchValue() {
    if (this.data) {
      this.form.patchValue(this.data);
      this.data.columns?.forEach((it, index) => {
        this.initColumns();
        this.columns.controls[index].setValue({
          configCode: it.configCode || null,
          configName: it.configName || null,
          dataType: it.dataType || null,
          required: it.required,
          urlLoadData: it.urlLoadData || null
        });
      });
    }
  }

  get columns(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  override initForm() {
    this.form = this.fb.group({
      moduleCode: this.data.moduleCode,
      configParameterId: this.data.configParameterId,
      configGroup: [null, [Validators.required, Validators.maxLength(255)]],
      configGroupName: [null, [Validators.required, Validators.maxLength(255)]],
      configPeriodType: [null, [Validators.required]],
      configColumns: this.fb.array([])
    }, {
      validators: [CustomValidators.formArrayValidator('configColumns', ['configCode'], 'configCode')]
    });
    if (!this.data.configGroup) {
      this.initColumns();
    }
  }

  initColumns(index?: number) {
    const controlsConfig: any = {};
    controlsConfig.configCode = [null, [Validators.required, Validators.maxLength(255)]];
    controlsConfig.configName = [null, [Validators.required, Validators.maxLength(255)]];
    controlsConfig.dataType = [null, Validators.required];
    controlsConfig.required = [null, Validators.required];
    controlsConfig.urlLoadData = [null];
    const profile = this.fb.group(controlsConfig);
    if (index) {
      this.columns.insert(index, profile);
    } else {
      this.columns.push(profile);
    }
  }

  initDataSelect() {
    this.listRequired = ObjectUtil.optionsToList(this.constant.LIST_REQUIRED, this.translate);
    this.listType = ObjectUtil.optionsToList(this.constant.LIST_TYPE, this.translate);
    this.listPeriodType = ObjectUtil.optionsToList(this.constant.LIST_PERIOD_TYPE, this.translate);
  }

  swapUp(index: number) {
    if (index > 0) {
      const temp = this.columns.at(index);
      this.columns.removeAt(index);
      this.columns.insert(index - 1, temp);
    }
  }

  swapDown(index: number) {
    if (index < this.columns.length - 1) {
      const temp = this.columns.at(index);
      this.columns.removeAt(index);
      this.columns.insert(index + 1, temp);
    }
  }


  addNewAttributes(index: number) {
    this.isSubmitted = true;
    if (this.columns.valid) {
      this.initColumns(index);
      this.isSubmitted = false;
    }
  }


  onDeleteAttributesClick(i: number) {
    this.popupService.showModalConfirmDelete(() => {
      this.columns.removeAt(i);
      if (this.columns.length == 0) {
        this.initColumns();
      }
    });
  }

  changeType(attribute: FormGroup) {
    if (['list', 'multi_list'].includes(attribute.controls['dataType'].value)) {
      attribute.controls['urlLoadData'].setValidators(Validators.required);
    } else {
      attribute.controls['urlLoadData'].setValue(null);
      attribute.controls['urlLoadData'].clearValidators();
    }
    attribute.controls['urlLoadData'].updateValueAndValidity();
  }


}

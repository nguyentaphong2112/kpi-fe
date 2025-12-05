import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { ConfigParameterService } from '@app/modules/admin/data-access/services/configurations/config-parameter.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { Utils } from '@core/utils/utils';

@Component({
  selector: 'app-parameter-form',
  templateUrl: './parameter-form.component.html',
  styleUrls: ['./parameter-form.component.scss']
})
export class ParameterFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {

  dataConfig: any;

  constructor(injector: Injector,
              private readonly configParameterService: ConfigParameterService) {
    super(injector);
    this.findOneById = (id) => this.configParameterService.findOneById(id, `/${this.dataConfig?.configGroup}`);
    this.createApi = (body: any) => this.configParameterService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, `/${this.dataConfig?.configGroup}`);
    this.updateApi = (body: any) => this.configParameterService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, `/${this.dataConfig?.configGroup}`);
    this.isPage = false;
    this.keyAttributeData = 'columns';
  }

  override ngOnInit() {
    this.initForm();
    this.getAttributes();
    this.initData();
    this.clearValidators();
  }

  override initForm() {
    this.form = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null],
      configGroup: [this.dataConfig?.configGroup],
      columns: this.fb.array([])
    }, {
      validators: [
        DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')
      ]
    });
    this.attributesFormArray = this.form?.get('columns') as FormArray;
  }

  getAttributes() {
    this.listAttributeConfig = this.dataConfig?.columns;
    if (this.mode === Mode.ADD) {
      this.listAttributeConfig?.forEach(item => {
        item.configValue = null;
        this.attributesFormArray?.push(this.createConfigsForm(item));
      });
    }
  }

  override beforeSave() {
    super.beforeSave();
    this.body.columns.forEach((el: NzSafeAny) => {
      if (el.dataType?.toUpperCase() === 'MULTI_LIST' && el.configValue != null) {
        if (Array.isArray(el.configValue)) {
          if (el.configValue.length === 0) {
            el.configValue = '';
          } else {
            el.configValue = ',' + el.configValue.join(',') + ',';
          }
        } else if (typeof el.configValue === 'string') {
          el.configValue = ',' + el.configValue + ',';
        } else {
          el.configValue = '';
        }
      }
    });
  }


  createConfigsForm(data: any): FormGroup {
    return this.fb?.group({
      configName: [data.configName],
      configCode: [data.configCode],
      dataType: [data.dataType?.toUpperCase()],
      isRequired: [data.required],
      urlLoadData: [data.urlLoadData],
      configValue: [data.configValue, data?.required ? [Validators.required] : []]
    });
  }

  override afterPatchValue() {
    if (this.attributesFormArray?.length > 0) {
      while (this.attributesFormArray?.length !== 0) {
        this.attributesFormArray?.removeAt(0);
      }
    }
    this.listAttributeConfig?.forEach(item => {
      const attributeData = this.data[this.keyAttributeData]?.find(v => v.configCode?.toLowerCase() === item.configCode?.toLowerCase());
      item.configValue = attributeData ? attributeData.configValue : null;
      if (item.dataType?.toUpperCase() === 'DATE') {
        item.configValue = Utils.convertDateToFillForm(item.configValue);
      }
      if (item.dataType?.toUpperCase() === 'MULTI_LIST') {
        item.configValue = item.configValue?.split(',').map((value: string) => value.trim()).filter((value: string) => value);
      }
      this.attributesFormArray?.push(this.createConfigsForm(item));
    });
  }

}

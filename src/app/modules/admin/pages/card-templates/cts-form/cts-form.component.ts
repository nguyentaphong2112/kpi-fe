import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { ObjectUtil } from '@core/utils/object.util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CardTemplatesModel } from '@app/modules/admin/data-access/models/card-templates/card-templates.model';
import { CardTemplatesService } from '@app/modules/admin/data-access/services/card-templates/card-templates.service';
import { CustomValidators } from '@core/utils/custom-validations';

@Component({
  selector: 'app-cts-form',
  templateUrl: './cts-form.component.html',
  styleUrls: ['./cts-form.component.scss']
})
export class CtsFormComponent extends BaseFormComponent<CardTemplatesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  listRequired: CategoryModel[] = [];
  listType: CategoryModel[] = [];
  constant = Constant;

  constructor(injector: Injector,
              private readonly  cardTemplatesService: CardTemplatesService
  ) {
    super(injector);
    this.initDataSelect();
    this.findOneById = (id) => this. cardTemplatesService.findOneById(id);
    this.createApi = (body: any) => this. cardTemplatesService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE);
    this.updateApi = (body: any) => this. cardTemplatesService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE);
    this.key = 'cardTemplateId';
  }

  ngOnInit() {
    super.ngOnInit();
  }

  override initForm() {
    this.form = this.fb.group({
      cardTemplateId: null,
      templateType: [null, [Validators.required]],
      isApplyAll: 'N',
      title: [null, [Validators.required]],
      files: [null, [Validators.required]],
      parameters: this.fb.array([]),
      defaultParameters: this.fb.array([]),
    }, {
      validators: [
        CustomValidators.formArrayValidator('defaultParameters', ['code'], 'code'),
        CustomValidators.formArrayValidator('defaultParameters', ['name'], 'name')
      ],
    });
    this.initDefaultParameter();
    this.initParameter();
  }

  patchValueInfo() {
    if (this.data) {
      this.form.patchValue({
        templateType: this.data.templateType,
        isApplyAll: this.data.isApplyAll,
        title: this.data.title,
        cardTemplateId: this.data.cardTemplateId,
      });
      const files = this.data.attachFileList?.map(item => {
        return {
          uid: item.attachmentId,
          name: item.fileName,
          checkSum: item.checkSum,
          status: 'done'
        };
      });
      this.f.files.setValue(files);

      this.data.listParameter?.forEach((it, index) => {
        if (index > 0) {
          this.initParameter();
        }
        this.parameters.controls[index].patchValue(it);
      });

      this.data.listDefaultParameter?.forEach((it, index) => {
        if (index > 0) {
          this.initDefaultParameter();
        }
        this.defaultParameters.controls[index].patchValue(it);
      });
    }
  }

  initDataSelect() {
    this.listRequired = ObjectUtil.optionsToList(this.constant.LIST_REQUIRED, this.translate);
    this.listType = ObjectUtil.optionsToList(this.constant.LIST_TYPE, this.translate);
  }

  get defaultParameters(): NzSafeAny {
    return this.form.controls.defaultParameters as FormArray;
  }

  get parameters(): NzSafeAny {
    return this.form.controls.parameters as FormArray;
  }

  initDefaultParameter() {
    const controlsConfig: any = {};
    controlsConfig.code = [null];
    controlsConfig.name = [null];
    const profile = this.fb.group(controlsConfig);
    this.defaultParameters.push(profile);
  }

  initParameter() {
    const controlsConfig: any = {};
    controlsConfig.code = [null];
    controlsConfig.name = [null];
    controlsConfig.defaultValue = [null];
    const profile = this.fb.group(controlsConfig);
    this.parameters.push(profile);
  }

  addNewDefaultParameter() {
    this.isSubmitted = true;
    if (this.defaultParameters.valid) {
      this.initDefaultParameter();
      this.isSubmitted = false;
    }
  }

  deleteDefaultParameter(i: number) {
    if (this.defaultParameters.length > 1) {
      this.popupService.showModalConfirmDelete(() => {
        this.defaultParameters.removeAt(i);
      });
    } else {
      this.popupService.showModalConfirmDelete(() => {
        this.defaultParameters.removeAt(i);
        this.initDefaultParameter();
      });
    }
  }

  changeDefaultParameter(index: number) {
    const keys = ['code', 'name'];
    const control = (this.defaultParameters.at(index) as FormControl);
    const isRequired = keys.some(key => control.get(key).value);
    keys.forEach(key => {
      control.get(key).setValidators(isRequired ? [Validators.required] : null);
      control.get(key).updateValueAndValidity();
    })
  }

  addNewParameter() {
    this.isSubmitted = true;
    if (this.parameters.valid) {
      this.initParameter();
      this.isSubmitted = false;
    }
  }

  deleteParameter(i: number) {
    if (this.parameters.length > 1) {
      this.popupService.showModalConfirmDelete(() => {
        this.parameters.removeAt(i);
      });
    } else {
      this.popupService.showModalConfirmDelete(() => {
        this.parameters.removeAt(i);
        this.initParameter();
      });
    }
  }

  changeParameter(index: number) {
    const keys = ['code', 'name', 'defaultValue'];
    const control = (this.parameters.at(index) as FormControl);
    const isRequired = keys.some(key => control.get(key).value);
    keys.forEach(key => {
      if (key != 'defaultValue') {
        control.get(key).setValidators(isRequired ? [Validators.required] : null);
      }
      control.get(key).updateValueAndValidity();
    })
  }

  beforeSave() {
    const data = this.form.value;
    if (data.defaultParameters?.length > 0) {
      data.defaultParameters = data.defaultParameters.filter(item => item.code)
    }
    if (data.parameters?.length > 0) {
      data.parameters = data.parameters.filter(item => item.code)
    }
    delete data?.files;
    this.body = {
      id: this.body.cardTemplateId,
      data: { ...data, attachmentDeleteIds: this.docIdsDelete },
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }
}

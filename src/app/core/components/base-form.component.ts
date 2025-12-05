import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BaseComponent } from '@core/components/base.component';
import { Mode } from '@shared/constant/common';
import { statusOptions } from '@core/models/IOption';
import { BaseResponse } from '@core/models/base-response';
import { CommonUtils } from '@shared/services/common-utils.service';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { Utils } from '@core/utils/utils';
import _ from 'lodash';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { FileAttach } from '@shared/model/file-attach.model';

@Component({
  template: `
    <ng-content></ng-content>`
})
export class BaseFormComponent<T> extends BaseComponent implements OnInit {
  data!: T;
  mode = Mode.ADD;
  isSubmitted = false;
  config: any;
  key = 'id';
  modalRef!: NzModalRef;
  statusOptions = statusOptions();
  listClearValidators: Array<string> = [];
  uri = '';
  body!: T;
  invalidFormViewChild = false;
  isPage = false;
  isNotClose = false;
  id: number;
  listAttributeConfig: any[] = [];
  keyAttributeData = 'listAttributes';
  attributesFormArray: FormArray;
  docIdsDelete: number[] = [];
  addSuccess = 'common.notification.addSuccess';
  updateSuccess = 'common.notification.updateSuccess';
  isConvertFindForm = true;

  findOneById!: (id: number | string) => Observable<any>;
  createApi!: (body: T) => Observable<any>;
  updateApi!: (body: T) => Observable<any>;
  getConfigAttributeApi!: () => Observable<any>;

  constructor(injector: Injector) {
    super(injector);
    try {
      this.modalRef = injector.get(NzModalRef);
    } catch (error) {
      this.modalRef = null;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.initData();
    this.clearValidators();
    this.isNotPageName = document.getElementsByClassName('inner-content--no-page-name').length > 0;
  }

  get f() {
    return this.form.controls;
  }

  initData() {
    if (this.isPage) {
      this.route.queryParams.subscribe((params: any) => {
        if (params.mode) {
          this.mode = Number(params.mode);
        }
        if (params.data) {
          this.data = JSON.parse(params.data);
        }
      });
    }
    if (this.mode === Mode.EDIT || this.mode === Mode.VIEW) {
      if (!this.data) {
        return;
      }
      this.id = (this.data as any)[this.key];
      this.findOneById(this.id)
        .subscribe(
          (res: BaseResponse<any>) => {
            this.data = this.isConvertFindForm ? CommonUtils.convertDataFindForm(res.data) : res.data;
            this.afterInitData();
            this.patchValueInfo();
            if (this.mode === Mode.VIEW) {
              this.form.disable();
            }
          },
          () => {
            this.modalRef?.close({ refresh: false });
          }
        );
    }
  }

  afterInitData() {
    // afterInitData
  }

  clearValidators() {
    if (this.mode === Mode.EDIT && this.listClearValidators && this.listClearValidators.length > 0) {
      this.listClearValidators.forEach(e => {
        this.form.controls[e].clearValidators();
      });
    }
  }

  initForm(defaultValue?: any) {
    // Init Form
  }

  patchValueInfo() {
    this.beforePatchValue();
    if (this.data) {
      this.form.patchValue(this.data);
    }
    this.afterPatchValue();
  }

  afterPatchValue() {
    if (this.data) {
      if (this.attributesFormArray?.length > 0) {
        while (this.attributesFormArray?.length !== 0) {
          this.attributesFormArray?.removeAt(0);
        }
      }
      this.listAttributeConfig?.forEach(item => {
        const attributeData = this.data[this.keyAttributeData]?.find(v => v.attributeCode?.toLowerCase() === item.code?.toLowerCase());
        item.value = attributeData ? attributeData.attributeValue : null;
        if (item.dataType?.toUpperCase() === 'DATE') {
          item.value = Utils.convertDateToFillForm(item.value);
        }
        if (item.dataType?.toUpperCase() === 'MULTI_LIST') {
          item.value = item.value?.split(',');
        }
        this.attributesFormArray?.push(this.createAttributesForm(item));
      });
    }
  }

  beforePatchValue() {
    // beforePatchValue
  }

  save() {
    this.isSubmitted = true;
    // cleanDataForm(this.form);
    this.body = _.clone(this.form.value);
    this.body['id'] = this.id;
    this.beforeSave();
    if (this.form.invalid || this.invalidFormViewChild) {
      return;
    }
    if (this.mode === Mode.ADD) {
      delete this.body[this.key];
      this.createApi(this.body)
        .subscribe(
          (res: BaseResponse<any>) => {
            if (res.code === HTTP_STATUS_CODE.SUCCESS) {
              this.toast.success(
                this.translate.instant(this.addSuccess)
              );
              this.afterSave(res);
              if (!this.isPage) {
                if (!this.isNotClose) {
                  this.modalRef?.close({ refresh: true });
                }
              } else {
                this.back();
              }
            }
          }
        );
    } else if (this.mode === Mode.EDIT) {
      this.updateApi(this.body)
        .subscribe(
          (res: BaseResponse<any>) => {
            if (res.code === HTTP_STATUS_CODE.SUCCESS) {
              this.toast.success(
                this.translate.instant(this.updateSuccess)
              );
              this.afterSave(res);
              if (!this.isPage) {
                if (!this.isNotClose) {
                  this.modalRef?.close({ refresh: true });
                }
              } else {
                this.back();
              }
            }
          }
        );
    }
  }

  beforeSave() {
    // beforeSave
    this.body[this.keyAttributeData]?.forEach((item: any) => {
      if (item.dataType === 'MULTI_LIST') {
        item.attributeValue = item.attributeValue?.join(',');
      }
    });
  }

  afterSave(res?: NzSafeAny) {

  }

  override handleDestroy() {
    this.modalRef?.destroy();
  }

  blur(controlName: string) {
    if (this.form.controls[controlName]) {
      this.form.controls[controlName]?.setValue(this.form.controls[controlName].value?.trim());
    }
  }

  getConfigAttributes(isLoadData = false) {
    this.getConfigAttributeApi().subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listAttributeConfig = res.data;
        for (const item of this.listAttributeConfig) {
          this.attributesFormArray?.push(this.createAttributesForm(item));
        }
        if (isLoadData) {
          this.afterPatchValue();
        }
      }
    });
  }

  createAttributesForm(data: any): FormGroup {
    return this.fb?.group({
      attributeName: [data.name],
      attributeCode: [data.code],
      dataType: [data.dataType?.toUpperCase()],
      isRequired: [data.required || data.isRequired],
      urlLoadData: [data.urlApi],
      attributeValue: [data.value, (data.required || data.isRequired) ? [Validators.required] : []]
    });
  }

  getAttributeControl(index: number, controlName: string): FormControl {
    return this.attributesFormArray?.at(index).get(controlName) as FormControl;
  }

  removeFile = (ids: number[], formControlName?: string, formControlDel?: string): boolean => {
    if (formControlDel) {
      this.f[formControlDel].setValue(ids);
    } else {
      this.docIdsDelete = ids;
    }
    return false;
  };

  convertFileToForm(files: FileAttach[]): any[] {
    return files?.map(item => {
      return {
        uid: item.attachmentId,
        name: item.fileName,
        checkSum: item.checkSum,
        status: 'done'
      };
    }) ?? [];
  }
}

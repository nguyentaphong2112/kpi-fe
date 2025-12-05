import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { DynamicReportService } from '@app/modules/admin/data-access/services/configurations/dynamic-report.service';
import { AbstractControl, FormArray, ValidatorFn, Validators } from '@angular/forms';
import { ObjectUtil } from '@core/utils/object.util';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';

export function noSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const hasSpace = (control.value || '').includes(' ');
    return hasSpace ? { space: true } : null;
  };
}

@Component({
  selector: 'app-drs-form',
  templateUrl: './drs-form.component.html',
  styleUrls: ['./drs-form.component.scss']
})
export class DrsFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  readonly FORM_ARRAY_NAME = 'reportParameterList';
  listReportType: CategoryModel[] = [];
  listDataType: CategoryModel[] = [];
  fileList: NzUploadFile[] = [];
  fileType: any[] = ['docx', 'doc', 'xlsx', 'xls'];
  serviceName = MICRO_SERVICE.ADMIN;
  urlDownload = UrlConstant.DYNAMIC_REPORTS.DOWNLOAD;

  constructor(injector: Injector,
              private dynamicReportService: DynamicReportService) {
    super(injector);
    this.initDataSelect();
    this.findOneById = (id) => this.dynamicReportService.findOneById(id);
    this.createApi = (body) => this.dynamicReportService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body) => this.dynamicReportService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.key = 'dynamicReportId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.patchFile();
  }

  override initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(255)]],
      code: [null, [Validators.required, Validators.maxLength(50)]],
      reportType: [null, [Validators.required]],
      reportParameterList: this.fb.array([]),
      reportQueryList: this.fb.array([])
    });
    if (this.mode === Mode.ADD) {
      this.initParameter();
      this.initQuery();
    }
  }

  override afterPatchValue() {
    if (this.data.parametersResponseList.length > 0) {
      this.data.parametersResponseList?.forEach((it, index) => {
        this.initParameter();
        this.reportParameterList.controls[index].setValue({
          name: it.name || null,
          title: it.title || null,
          isRequired: (it.isRequired === 'Y'),
          appendQuery: it.appendQuery || null,
          dataType: it.dataType || null,
          urlApi: it.urlApi || null
        });
      });
    } else {
      this.initParameter();
    }
    if (this.data.queryResponseList.length > 0) {
      this.data.queryResponseList?.forEach((it, index) => {
        this.initQuery();
        this.reportQueryList.controls[index].setValue({
          sqlQuery: it.sqlQuery || null
        });
      });
    } else {
      this.initQuery();
    }
  }

  patchFile() {
    if (this.data?.attachmentFileList) {
      this.data.attachmentFileList?.forEach((item: any) => {
        this.fileList.push({
          uid: item.attachmentId,
          name: item.fileName,
          checkSum: item.checkSum,
          status: 'done'
        });
      });
    }
  }


  get reportParameterList(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  get reportQueryList(): FormArray {
    return this.form.get('reportQueryList') as FormArray;
  }

  initQuery() {
    const controlsConfig: any = {};
    controlsConfig.sqlQuery = [null];
    const profile = this.fb.group(controlsConfig);
    this.reportQueryList.push(profile);
  }

  addQuery(index: number) {
    this.reportQueryList.at(index).get('sqlQuery').setValidators([Validators.required]);
    this.reportQueryList.at(index).get('sqlQuery').updateValueAndValidity();
    this.isSubmitted = true;
    if (this.reportQueryList.valid) {
      this.initQuery();
      this.isSubmitted = false;
    }
  }

  removeQuery(index: number) {
    this.popupService.showModalConfirmDelete(() => {
      this.reportQueryList.removeAt(index);
    });
  }


  initParameter() {
    const controlsConfig: any = {};
    controlsConfig.name = [null, [Validators.required, Validators.maxLength(255), noSpaceValidator()]];
    controlsConfig.appendQuery = [null, [Validators.maxLength(4000)]];
    controlsConfig.title = [null, [Validators.required, Validators.maxLength(255)]];
    controlsConfig.isRequired = [false];
    controlsConfig.dataType = [null, Validators.required];
    controlsConfig.urlApi = [null];
    const profile = this.fb.group(controlsConfig);
    this.reportParameterList.push(profile);
  }

  initDataSelect() {
    this.listReportType = ObjectUtil.optionsToList(Constant.LIST_REPORT_TYPE, this.translate);
    this.listDataType = ObjectUtil.optionsToList(Constant.LIST_DATA_TYPE, this.translate);
  }


  addNewParameter() {
    this.isSubmitted = true;
    if (this.reportParameterList.valid) {
      this.initParameter();
      this.isSubmitted = false;
    }
  }

  getFileType($event: any) {
    if ($event === 'EXCEL') {
      this.fileType = ['xlsx', 'xls'];
    } else if ($event === 'DOC') {
      this.fileType = ['docx', 'doc'];
    } else {
      this.fileType = ['pdf']
    }
  }


  onDeleteParameterClick(i: number) {
    if (this.reportParameterList.length > 1) {
      this.popupService.showModalConfirmDelete(() => {
        this.reportParameterList.removeAt(i);
      });
    } else {
      this.popupService.showModalConfirmDelete(() => {
        this.reportParameterList.removeAt(i);
        this.initParameter();
      });
    }
  }

  onFileListChange(event: NzUploadFile[]): void {
    this.fileList = event;
  }

  beforeSave() {
    this.body.reportParameterList = this.body.reportParameterList.map((item: any) => {
      return {
        ...item,
        isRequired: item.isRequired ? 'Y' : 'N'
      };
    });
    this.body.fileTemplate = this.fileList.find(item => item instanceof File) || null;
  }

}

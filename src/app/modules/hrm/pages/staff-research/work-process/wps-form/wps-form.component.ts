import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { Utils } from '@core/utils/utils';
import { WorkProcessService } from '@app/modules/hrm/data-access/services/staff-research/work-process.service';
import { WorkProcessModel } from '@app/modules/hrm/data-access/models/research/work-process.model';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { distinctUntilChanged } from 'rxjs';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { WorkProcessCustomService } from '@app/modules/hrm/data-access/services/staff-research/work-process-custom.service';
import { CustomValidators } from '@core/utils/custom-validations';

@Component({
  selector: 'app-wps-form',
  templateUrl: './wps-form.component.html',
  styleUrls: ['./wps-form.component.scss']
})
export class WpsFormComponent extends BaseFormComponent<WorkProcessModel> implements OnInit {
  urlConstant = UrlConstant;
  isHideWhenTypeOut = false;
  showSwitchType = false;
  configDate: any;
  employeeId: number;
  data: any;
  hiddenEmp = false;
  listDocumentType: any[] = [];
  listPercent: any[] = [];
  functionCode = FunctionCode.HR_WORK_PROCESS;
  scope = Scopes.CREATE;
  mapValidateRequired = new Map<number, boolean>();

  constructor(
    private readonly service: WorkProcessService,
    private readonly serviceCustom: WorkProcessCustomService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
    this.key = 'workProcessId';
    this.getListDocumentType();
    this.getListPercent();
    this.getConfigDate();
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: WorkProcessModel) => this.serviceCustom.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: WorkProcessModel) => this.serviceCustom.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_worked_process' });
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
    this.changeDocumentType();
  }

  override initForm() {
    this.form = this.fb.group({
      workProcessId: [null],
      employeeId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      isCategoryRequest: [true],
      documentTypeId: [null, [Validators.required]],
      jobTitle: [null],
      departmentName: [null],
      documentNo: [null],
      documentSignedDate: [null],
      files: [null],
      listAttributes: this.fb.array([]),
      positions: this.fb.array([])
    }, {
      validators: [CustomValidators.formArrayValidator('positions', ['organizationId', 'positionId'], 'positionId')]
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
    this.initListPositionForm();
  }

  get listPositions(): FormArray {
    return this.f['positions'] as FormArray;
  }

  initListPositionForm() {
    this.listPositions.push(this.createPositionForm(null, 'hrm.staffManager.workProcess.label.attributes.workJob', true, Constant.SALARY_TYPES.CONG_VIEC));
    this.listPositions.push(this.createPositionForm(null, 'hrm.staffManager.workProcess.label.attributes.positionManage', false));
    this.listPositions.push(this.createPositionForm(null, 'hrm.staffManager.workProcess.label.attributes.positionConcurrent', false));
  }

  createPositionForm(data, labelPositionText, isRequired: boolean, type = Constant.SALARY_TYPES.CHUC_VU) {
    return this.fb?.group({
      organizationId: [data?.organizationId, isRequired ? [Validators.required] : null],
      positionId: [data?.positionId, isRequired ? [Validators.required] : null],
      percentageId: [data?.percentageId, isRequired ? [Validators.required] : null],
      documentSignedDate: [data?.documentSignedDate],
      documentNo: [data?.documentNo],
      labelPositionText: [labelPositionText ?? 'hrm.staffManager.workProcess.label.attributes.positionConcurrent'],
      isRequired: [isRequired],
      typeJob: [type],
      listPosition: [data?.listPositions ?? []]
    });
  }

  getListDocumentType(isCache = true) {
    this.subscriptions.push(
      this.dataService.getData(this.urlConstant.DOCUMENT_TYPES.GET_LIST, this.microService.HRM, isCache).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listDocumentType = res.data;
        }
      })
    );
  }

  getListPercent(isCache = true) {
    this.subscriptions.push(
      this.dataService.getData(this.getUrlCategory(this.categoryCode.TY_LE), this.microService.ADMIN, isCache).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listPercent = res.data;
        }
      })
    );
  }

  getConfigDate() {
    const url = this.urlConstant.PARAMETER_CONFIG;
    const key = 'HR_MIN_WORK_PROCESS_DATE';
    this.subscriptions.push(
      this.dataService.getDataByParam(url, { configCodes: key }, this.microService.ADMIN).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.configDate = res.data[key];
        }
      })
    );
  }

  changeDocumentType() {
    this.subscriptions.push(
      this.f.documentTypeId.valueChanges.pipe(distinctUntilChanged()).subscribe(documentTypeId => {
        this.isHideWhenTypeOut = false;
        const documentType = this.listDocumentType?.find(item => item.documentTypeId === documentTypeId)?.type;
        if (documentType && documentType.toUpperCase() === 'OUT') {
          this.isHideWhenTypeOut = true;
          this.form.contains('positions') && this.form.removeControl('positions');
        } else if (!this.f.isCategoryRequest.value) {
          this.form.contains('positions') && this.form.removeControl('positions');
        } else if (!this.form.contains('positions')) {
          this.form.addControl('positions', this.fb.array([]));
          this.initListPositionForm();
        }
      })
    );
  }

  updateValueAndValidityForm(keys: string[]) {
    keys.forEach(key => {
      this.f[key].updateValueAndValidity();
    });
  }

  removeValidateForm(keys: string[]) {
    keys.forEach(key => {
      this.f[key].setValidators(null);
      this.f[key].reset(null);
    });
  }

  addValidateRequired(keys: string[]) {
    keys.forEach(key => {
      this.f[key].setValidators([Validators.required]);
    });
  }

  changeStartDate(event) {
    if (this.configDate) {
      const configDate = Utils.convertDateToFillForm(this.configDate);
      this.showSwitchType = event && event < configDate;
      this.f.isCategoryRequest.setValue(!this.showSwitchType);
      this.changeCategoryRequest(this.f.isCategoryRequest.value);
    }
  }

  changeCategoryRequest(event: boolean) {
    const keys = ['departmentName', 'jobTitle'];
    if (event) {
      this.removeValidateForm(keys);
      if (!this.form.contains('positions')) {
        this.form.addControl('positions', this.fb.array([]));
        this.initListPositionForm();
      }
    } else {
      this.addValidateRequired(keys);
      this.form.contains('positions') && this.form.removeControl('positions');
    }
    this.updateValueAndValidityForm([...keys]);
    this.cdRef.detectChanges();
  }

  addPositionProcess(i: number) {
    this.setValidatePositionForm(i, true);
    this.listPositions.push(this.createPositionForm(null, null, false));
  }

  removePositionProcess(index: number) {
    this.listPositions.removeAt(index);
    this.changePositionInfo(this.listPositions.length - 1);
  }

  changePositionInfo(index: number, isChangeOrg?: boolean) {
    const control = this.listPositions.at(index);
    if (isChangeOrg) {
      this.changeOrgInfo(index);
    }

    const keys = ['organizationId', 'positionId', 'percentageId'];
    if (keys.some(key => control.value[key])) {
      this.setValidatePositionForm(index, true);
    } else if (index === this.listPositions.length - 1 || index === 1) {
      this.setValidatePositionForm(index, false);
    }
  }

  changeOrgInfo(index: number) {
    const control = this.listPositions.at(index);
    control?.get('listPosition').setValue([]);

    let listJobType: string[];
    if (index === 0) {
      listJobType = [Constant.SALARY_TYPES.CONG_VIEC];
    } else if (index === 1) {
      listJobType = [Constant.SALARY_TYPES.CHUC_VU];
    } else {
      listJobType = [Constant.SALARY_TYPES.CONG_VIEC, Constant.SALARY_TYPES.CHUC_VU];
    }
    if (control?.value?.organizationId) {
      const urlEndPoint = `${UrlConstant.POSITIONS.GET_BY_ORG}/${control.value.organizationId}`;
      this.subscriptions.push(
        this.dataService.getDataByParam(urlEndPoint, { listJobType: listJobType }, this.microService.HRM, true).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            control.get('listPosition').setValue(res.data);
            if (!res.data.some((item: any) => item.positionId === control.value.positionId)) {
              control.get('positionId').reset();
            }
          }
        })
      );
    } else {
      control.get('positionId').reset();
    }
  }

  setValidatePositionForm(index: number, isRequired: boolean) {
    const keys = ['organizationId', 'positionId', 'percentageId'];
    (this.listPositions.at(index) as FormControl).get('isRequired').setValue(isRequired);
    keys.forEach(key => {
      const control = (this.listPositions.at(index) as FormControl).get(key);
      control.setValidators(isRequired ? [Validators.required] : null);
      this.mapValidateRequired.set(index, isRequired);
      control.updateValueAndValidity();
    });
  }

  async patchValueInfo() {
    this.f.startDate.setValue(Utils.convertDateToFillForm(this.data.startDate));
    delete this.data.startDate;
    this.f.isCategoryRequest.setValue(!this.data.departmentName);
    this.form.patchValue(this.data);
    const files = this.data.attachFileList?.map(item => {
      return {
        uid: item.attachmentId,
        name: item.fileName,
        checkSum: item.checkSum,
        status: 'done'
      };
    });
    this.f.files.setValue(files);
    this.f.documentTypeId.setValue(this.data.documentTypeId, { emitEvent: true });
    if (this.listPositions) {
      let index = 0;
      for (const item of this.data.positions) {
        let listJobType: string[];
        if (index === 0) {
          listJobType = [Constant.SALARY_TYPES.CONG_VIEC];
        } else if (index === 1) {
          listJobType = [Constant.SALARY_TYPES.CHUC_VU];
        } else {
          listJobType = [Constant.SALARY_TYPES.CONG_VIEC, Constant.SALARY_TYPES.CHUC_VU];
        }
        if (item?.organizationId) {
          const urlEndPoint = `${UrlConstant.POSITIONS.GET_BY_ORG}/${item.organizationId}`;
          const res = await this.dataService.getDataByParam(urlEndPoint, { listJobType: listJobType }, this.microService.HRM, true).toPromise();
          if (res?.code === HTTP_STATUS_CODE.SUCCESS) {
            item.listPositions = res.data;
          }
        }
        if (index <= 2) {
          this.listPositions.controls[index].patchValue(item);
        } else {
          this.listPositions.push(this.createPositionForm(item, null, true));
        }

        if (!item?.listPositions?.some((data: any) => data.positionId === this.listPositions.at(index).value.positionId)) {
          this.listPositions.at(index).get('positionId').reset();
        }
        index++;
      }
    }
    if (this.mode === Mode.VIEW) {
      this.form.disable();
    }
    this.afterPatchValue();
  }

  beforeSave() {
    const data = this.form.value;
    if (data.positions?.length > 0) {
      if (!data.positions[1]?.organizationId && data.positions.length > 2) {
        data.positions[1] = null;
      }
      data.positions = data.positions.filter((item, index) => index === 1 || item?.organizationId);
    } else {
      data.positions = [];
    }
    delete data?.files;
    this.body = {
      id: this.body.workProcessId,
      data: { ...data, attachmentDeleteIds: this.docIdsDelete },
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }

}

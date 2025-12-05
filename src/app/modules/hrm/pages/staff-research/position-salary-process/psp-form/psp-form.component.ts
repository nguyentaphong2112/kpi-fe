import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { PositionSalaryProcessModel } from '@app/modules/hrm/data-access/models/research/position-salary-process.model';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { PositionSalaryProcessServiceV2 } from '@app/modules/hrm/data-access/services/staff-research/position-salary-process.service-v2';

@Component({
  selector: 'app-psp-form',
  templateUrl: './psp-form.component.html',
  styleUrls: ['./psp-form.component.scss']
})
export class PspFormComponent extends BaseFormComponent<PositionSalaryProcessModel> implements OnInit {
  hiddenEmp = false;
  employeeId: number;
  urlConstant = UrlConstant;
  listSalaryRank: CategoryModel[] = [];
  functionCode = FunctionCode.HR_POSITION_SALARY_PROCESS;
  scope = Scopes.CREATE;

  constructor(
    private readonly service: PositionSalaryProcessServiceV2,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'positionSalaryProcessId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: PositionSalaryProcessModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: PositionSalaryProcessModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_position_salary_process' });
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
    this.getListSalaryRank();
  }

  override initForm() {
    this.form = this.fb.group({
      positionSalaryProcessId: [null],
      employeeId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      documentNo: [null],
      documentSignedDate: [null],
      files: [null],
      formData: this.fb.array([]),
      listAttributes: this.fb.array([])
    }, {
      validators: [
        DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')
      ]
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
    this.listPositionSalary.push(this.createPositionSalaryForm(null));
  }

  get listPositionSalary(): FormArray {
    return this.f['formData'] as FormArray;
  }

  createPositionSalaryForm(data: any) {
    return this.fb?.group({
      positionSalaryProcessId: [data?.positionSalaryProcessId],
      salaryType: [data?.salaryType, [Validators.required]],
      jobId: [data?.jobId, [Validators.required]],
      salaryRankId: [data?.salaryRankId, [Validators.required]],
      salaryGradeId: [data?.salaryGradeId, [Validators.required]],
      percent: [data?.percent, [Validators.required, Validators.max(100)]],
      listJobs: [data?.listJobs ?? []],
      listSalaryGrades: [data?.listSalaryGrades ?? []],
    });
  }

  changeSalaryType(index: number, value: string) {
    const control = this.listPositionSalary.at(index);
    control.get('listJobs').setValue([]);
    if (value) {
      const type = value.startsWith(Constant.POSITION_SALARY_TYPE.CHUC_DANH) ? Constant.POSITION_SALARY_TYPE.CONG_VIEC : Constant.POSITION_SALARY_TYPE.CHUC_VU;
      this.subscriptions.push(
        this.dataService.getDataByParam(this.urlConstant.JOBS.GET_ALL, {jobType: [type]}, MICRO_SERVICE.HRM).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            control.get('listJobs').setValue(res.data);
            if (!res.data.some((item: any) => item.jobId === control.value.jobId)) {
              control.get('jobId').reset();
            }
          }
        })
      );
    } else {
      this.f.jobId.reset();
    }
  }

  getListSalaryRank() {
    const listSalaryType = [Constant.SALARY_TYPES.CHUC_VU, Constant.SALARY_TYPES.CHUC_DANH]
    this.subscriptions.push(
      this.dataService.getDataByParam(UrlConstant.SALARY_RANKS.GET_BY_LIST_TYPE, {listSalaryType: listSalaryType}, MICRO_SERVICE.HRM).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listSalaryRank = res.data;
        }
      })
    )
  }

  changeSalaryRank(index: number, value: string) {
    const control = this.listPositionSalary.at(index);
    control.get('listSalaryGrades').setValue([]);
    if (value) {
      const url = this.urlConstant.SALARIES.LIST_SALARY_GRADES.replace('{rankId}', value);
      this.subscriptions.push(
        this.dataService.getData(url, MICRO_SERVICE.HRM).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            control.get('listSalaryGrades').setValue(res.data);
            if (!res.data.some((item: any) => item.salaryGradeId === control.value.salaryGradeId)) {
              control.get('salaryGradeId').reset();
            }
          }
        })
      );
    } else {
      this.f.salaryGradeId.reset();
    }
  }

  async patchValueInfo() {
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

    while (this.listPositionSalary.length > 0) {
      this.listPositionSalary.removeAt(0);
    }
    for (const item of this.data.formData) {
      const type = item.salaryType?.startsWith(Constant.POSITION_SALARY_TYPE.CHUC_DANH) ? Constant.POSITION_SALARY_TYPE.CONG_VIEC : Constant.POSITION_SALARY_TYPE.CHUC_VU;
      const resJob = await this.dataService.getDataByParam(this.urlConstant.JOBS.GET_ALL, {jobType: [type]}, MICRO_SERVICE.HRM).toPromise();
      if (resJob.code === HTTP_STATUS_CODE.SUCCESS) {
        item.listJobs = resJob.data;
      }
      const resSalaryGrade = await this.dataService.getData(this.urlConstant.SALARIES.LIST_SALARY_GRADES.replace('{rankId}', item.salaryRankId), MICRO_SERVICE.HRM).toPromise();
      if (resSalaryGrade.code === HTTP_STATUS_CODE.SUCCESS) {
        item.listSalaryGrades = resSalaryGrade.data;
      }
      if (item.percent) {
        item.percent = item.percent?.toString();
      }
      this.listPositionSalary.push(this.createPositionSalaryForm(item));
    }

    if (this.mode === Mode.VIEW) {
      this.form.disable();
    }
    this.afterPatchValue();
  }

  beforeSave() {
    const data = this.form.value;
    delete data?.files;
    data.salaryType = data.salaryType?.startsWith(Constant.POSITION_SALARY_TYPE.CHUC_DANH) ? Constant.POSITION_SALARY_TYPE.CHUC_DANH : Constant.POSITION_SALARY_TYPE.CHUC_VU;
    this.body = {
      id: this.body.positionSalaryProcessId,
      data: { ...data, attachmentDeleteIds: this.docIdsDelete },
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }

  addPositionSalary() {
    this.isSubmitted = true;
    if (this.f.formData.valid) {
      this.listPositionSalary.push(this.createPositionSalaryForm(null));
    }
  }

  removePositionSalary(index: number) {
    this.listPositionSalary.removeAt(index);
  }
}


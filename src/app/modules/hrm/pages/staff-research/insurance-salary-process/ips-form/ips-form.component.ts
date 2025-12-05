import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { DataService } from '@shared/services/data.service';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { CatalogModel } from '@shared/model/catalog-model';
import { distinctUntilChanged } from 'rxjs';
import {
  InsuranceSalaryProcessModel
} from '@app/modules/hrm/data-access/models/research/insurance-salary-process.model';
import {
  InsuranceSalaryProcessService
} from '@app/modules/hrm/data-access/services/staff-research/insurance-salary-process.service';
import { CategoryModel } from '@core/models/category-common.interface';
import { SelectModal } from '@shared/component/hbt-select/select.component';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';
import { format } from 'date-fns';

@Component({
  selector: 'app-ips-form',
  templateUrl: './ips-form.component.html',
  styleUrls: ['./ips-form.component.scss']
})
export class IpsFormComponent extends BaseFormComponent<InsuranceSalaryProcessModel> implements OnInit {
  urlConstant = UrlConstant;
  serviceName = MICRO_SERVICE.HRM;
  listSalaryGrades: CatalogModel[] = [];
  listSalaryRank: CatalogModel[] = [];
  data: any;
  hiddenEmp = false;
  employeeId: number;
  listEmpType: CategoryModel[] = [];
  functionCode = FunctionCode.HR_INSURANCE_SALARY_PROCESS;
  scope = Scopes.CREATE;
  isShowSalaryGrade = false;
  isShowSalaryRank = false;
  isDisableSalaryRank = true;

  constructor(
    private readonly service: InsuranceSalaryProcessService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.getListJobSalary();
    this.key = 'insuranceSalaryProcessId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: InsuranceSalaryProcessModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: InsuranceSalaryProcessModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA_FILE, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_insurance_salary_process' });
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
    this.changeSalaryRank();
  }

  override initForm() {
    this.form = this.fb.group({
      insuranceSalaryProcessId: [null],
      employeeId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      salaryRankId: [null, [Validators.required]],
      salaryGradeId: [null, [Validators.required]],
      percent: [null, [Validators.required, Validators.max(100)]],
      reserveFactor: [null],
      documentNo: [null, [Validators.maxLength(50)]],
      documentSignedDate: [null],
      jobSalaryId: [null],
      empTypeId: [null],
      amount: [null],
      incrementDate: [null],
      factor: [null],
      files: [null],
      listAttributes: this.fb.array([])
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;    
  }

  getListJobSalary() {
    this.subscriptions.push(
      this.dataService.getDataByParam(UrlConstant.EMP_TYPES.GET_LIST, { isGetAttributes: true }, MICRO_SERVICE.HRM).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listEmpType = res.data;
        }
      })
    );
  }

  changeEmpType(empTypeId: number) {
    this.listSalaryGrades = [];
    if (empTypeId && this.f.startDate.value) {
      this.subscriptions.push(
        this.dataService.getDataByParam(UrlConstant.SALARIES.LIST_SALARY_RANKS, {
          empTypeId: empTypeId,
          startDate: format(this.f.startDate.value, 'yyyy-MM-dd')
        }, MICRO_SERVICE.HRM).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.listSalaryRank = res.data;
            if (!this.listSalaryRank.some((item: any) => item.salaryRankId === this.f.salaryRankId.value)) {
              this.f.salaryRankId.reset();
            }
            this.isShowSalaryRank = this.listSalaryRank?.length > 0;
            this.validateSalaryInfo();
          }
        })
      );
    } else {
      this.isShowSalaryRank = true;
      this.validateSalaryInfo();
    }
  }

  validateSalaryInfo() {
    this.setValidateForm('salaryRankId', this.isShowSalaryGrade);
    this.setValidateForm('salaryGradeId', this.isShowSalaryGrade);
    this.setValidateForm('percent', this.isShowSalaryGrade);
    this.setValidateForm('amount', !this.isShowSalaryGrade);
  }

  setValidateForm(formControlName: string, isRequired: boolean) {
    this.f[formControlName].setValidators(isRequired ? [Validators.required] : null);
    this.f[formControlName].updateValueAndValidity();
  }

  changeSalaryRank() {
    this.subscriptions.push(
      this.f.salaryRankId.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
        this.listSalaryGrades = [];
        if (value) {
          const url = this.urlConstant.SALARIES.LIST_SALARY_GRADES.replace('{rankId}', value);
          this.subscriptions.push(
            this.dataService.getData(url, MICRO_SERVICE.HRM).subscribe(res => {
              if (res.code === HTTP_STATUS_CODE.SUCCESS) {
                this.listSalaryGrades = res.data;
                if (this.listSalaryGrades.length > 0) {
                  this.isShowSalaryGrade = true;
                } else {
                  this.isShowSalaryGrade = false;
                }
                this.validateSalaryInfo();
                if (!this.listSalaryGrades.some((item: any) => item.salaryGradeId === this.f.salaryGradeId.value)) {
                  this.f.salaryGradeId.reset();
                }
              }
            })
          );
        } else {
          this.f.salaryGradeId.reset();
        }
      })
    );
  }

  changeStartDate(startDate) {
    if (!this.f.incrementDate.value) {
      this.f.incrementDate.setValue(startDate);
    }
    this.isDisableSalaryRank = startDate == null;
    
    this.dataService.getDataByParam(UrlConstant.SALARIES.LIST_SALARY_RANKS, {
      startDate: format(this.f.startDate.value, 'yyyy-MM-dd')
    }, MICRO_SERVICE.HRM).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listSalaryRank = res.data;
        if (!this.listSalaryRank.some((item: any) => item.salaryRankId === this.f.salaryRankId.value)) {
          this.f.salaryRankId.reset();
        }
        this.validateSalaryInfo();
      }
    });
  }

  changeSalaryGrade(event: SelectModal) {
    this.f.factor.setValue(event?.itemSelected?.amount);
  }

  patchValueInfo() {
    if (this.data.percent) {
      this.data.percent = this.data.percent.toString();
    }
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
  }

  beforeSave() {
    this.resetValueForm();
    const data = this.form.value;
    delete data?.files;
    this.body = {
      id: this.body.insuranceSalaryProcessId,
      data: { ...data, attachmentDeleteIds: this.docIdsDelete },
      files: this.f.files.value?.filter(item => item instanceof File)
    };
  }

  resetValueForm() {
    let keys;
    if (this.isShowSalaryGrade) {
      keys = ['amount'];
    } else {
      keys = ['salaryGradeId', 'factor', 'percent', 'reserveFactor', 'incrementDate'];
    } 
    keys?.forEach(key => {
      this.f[key].setValue(null);
    });
  }
}

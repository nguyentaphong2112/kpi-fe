import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE, TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { SalaryRanksService } from '@app/modules/hrm/data-access/services/category-manage/salary-ranks.service';
import { AbstractControl, FormArray, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { ObjectUtil } from '@core/utils/object.util';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HBTTableConfig } from '@shared/component/hbt-table/hbt-table.interfaces';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { JobsService } from '@app/modules/hrm/data-access/services/model-plan/jobs.service';


function uniqueFieldValidator(fieldName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }
    const formArray = control.parent.parent;
    if (!formArray) {
      return null;
    }
    const fieldValues = formArray.value.map((group: any) => group[fieldName]);
    const duplicate = fieldValues.filter((value: any) => value == control.value).length > 1;

    return duplicate ? { [`${fieldName}Duplicate`]: true } : null;
  };
}

@Component({
  selector: 'app-srs-form',
  templateUrl: './srs-form.component.html',
  styleUrls: ['./srs-form.component.scss']
})
export class SrsFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  listSalaryType: CategoryModel[] = [];
  readonly FORM_ARRAY_NAME = 'grades';
  tableData: any[] = [];
  listJobData: any[] = [];
  tableConfig: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  @ViewChild('actionTmpl', { static: true }) actionTpl!: TemplateRef<NzSafeAny>;

  constructor(injector: Injector,
              private salaryRanksService: SalaryRanksService,
              private dataService: DataService,
              private jobService: JobsService) {
    super(injector);
    this.initDataSelect();
    this.findOneById = (id) => this.salaryRanksService.findOneById(id);
    this.createApi = (body: any) => this.salaryRanksService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.salaryRanksService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'hr_salary_ranks'
    });
    this.isPage = false;
    this.key = 'salaryRankId';
    this.getConfigAttributes();
  }

  get grades(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  initDataSelect() {
    this.listSalaryType = ObjectUtil.optionsToList(Constant.SALARY_TYPE, this.translate);
    this.jobService.getList({ jobType: Constant.SALARY_TYPES.HUONG_LUONG }, UrlConstant.JOBS.GET_BY_JOB_TYPE)
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listJobData = res.data;
        }
      });
  }

  ngOnInit() {
    this.setHeaders();
    super.ngOnInit();
  }


  afterPatchValue() {
    super.afterPatchValue();
    if (this.data) {
      this.data.salaryJobs?.forEach(item => {
        this.getValueTable(item?.jobId);
      });
      this.data?.grades?.forEach((it, index) => {
        this.initGrades();
        this.grades.controls[index].setValue({
          salaryGradeId: it.salaryGradeId || null,
          amount: it.amount || null,
          duration: it.duration || null,
          name: it.gradeName || null,
          note: it.note || null
        });
      });
    }
  }

  override initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(255)]],
      code: [null, [Validators.required, Validators.maxLength(255)]],
      orderNumber: [null],
      jobData: [null],
      salaryType: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      listAttributes: this.fb.array([]),
      grades: this.fb.array([])
    }, {
      validators: [
        DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')
      ]
    });
    if (this.mode === Mode.ADD) {
      this.initGrades();
    }
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  initGrades() {
    const controlsConfig: any = {};
    controlsConfig.amount = [null, [Validators.maxLength(23), uniqueFieldValidator('amount')]];
    controlsConfig.duration = [null, Validators.maxLength(5)];
    controlsConfig.name = [null, [Validators.maxLength(255), uniqueFieldValidator('name')]];
    controlsConfig.note = [null];
    controlsConfig.salaryGradeId = [null];
    const profile = this.fb.group(controlsConfig);
    this.grades.push(profile);
  }

  addNewAttributes() {
    this.isSubmitted = true;
    if (this.grades.valid) {
      this.initGrades();
      this.isSubmitted = false;
    }
  }


  onDeleteAttributesClick(i: number) {
    if (this.grades.length > 1) {
      this.popupService.showModalConfirmDelete(() => {
        this.grades.removeAt(i);
      });
    } else {
      this.popupService.showModalConfirmDelete(() => {
        this.grades.removeAt(i);
        this.initGrades();
      });
    }
  }

  setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.codeJob',
        field: 'code',
        width: 200,
        thClassList: ['text-center'],
        tdClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.nameJob',
        field: 'name',
        width: 200,
        thClassList: ['text-center'],
        tdClassList: ['text-center']
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }

  deleteJob(id: number) {
    this.popupService.showModalConfirmDelete(() => {
      this.listJobData = [
        ...this.listJobData,
        this.tableData.find(item => item.jobId === id)
      ];
      this.tableData = this.tableData.filter(item => item.jobId !== id);
    });
  }

  getValueTable($event: any) {
    if ($event && this.listJobData.length > 0) {
      this.tableData = [
        ...this.tableData,
        this.listJobData.find(item => item.jobId === $event)
      ];
      this.listJobData = this.listJobData.filter((item => item.jobId !== $event));
      setTimeout(() => {
        this.form.get('jobData').setValue(null);
      });
    }
  }

  beforeSave() {
    super.beforeSave();
    this.body.jobIds = this.tableData.map(item => item?.jobId);
  }


}

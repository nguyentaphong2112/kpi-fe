import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { DisciplineProcessModel } from '@app/modules/hrm/data-access/models/research/discipline-process.model';
import { DisciplineProcessService } from '@app/modules/hrm/data-access/services/staff-research/discipline-process.service';
import { DataService } from '@shared/services/data.service';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';

@Component({
  selector: 'app-dps-form',
  templateUrl: './dps-form.component.html',
  styleUrls: ['./dps-form.component.scss']
})
export class DpsFormComponent extends BaseFormComponent<DisciplineProcessModel> implements OnInit {

  serviceName = MICRO_SERVICE.HRM;
  urlLoadData = '/discipline-process';
  hiddenEmp = false;
  data: any;
  employeeId: number;
  functionCode = FunctionCode.HR_DISCIPLINE_PROCESS;
  scope = Scopes.CREATE;

  constructor(
    private readonly service: DisciplineProcessService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'disciplineProcessId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: DisciplineProcessModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: DisciplineProcessModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_discipline_process' });
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
  }


  override initForm() {
    this.form = this.fb.group({
      disciplineProcessId: [null],
      employeeId: [null, [Validators.required]],
      disciplineFormId: [null, [Validators.required, Validators.maxLength(50)]],
      reason: [null, [Validators.required, Validators.maxLength(500)]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      documentNo: [null, [Validators.maxLength(50)]],
      documentSignedDate: [null],
      signedDepartment: [null, [Validators.required, Validators.maxLength(255)]],
      listAttributes: this.fb.array([])
    }, {
      validators:
        [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }
}

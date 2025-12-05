import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { DataService } from '@shared/services/data.service';
import { AwardProcessModel } from '@app/modules/hrm/data-access/models/research/award-process.model';
import { AwardProcessService } from '@app/modules/hrm/data-access/services/staff-research/award-process.service';
import { Utils } from '@core/utils/utils';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';

@Component({
  selector: 'app-aps-form',
  templateUrl: './aps-form.component.html',
  styleUrls: ['./aps-form.component.scss']
})
export class ApsFormComponent extends BaseFormComponent<AwardProcessModel> implements OnInit {

  serviceName = MICRO_SERVICE.HRM;
  urlLoadData = '/award-process';
  data: any;
  hiddenEmp = false;
  employeeId: number;
  functionCode = FunctionCode.HR_AWARD_PROCESS;
  scope = Scopes.CREATE;

  constructor(
    private readonly service: AwardProcessService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'awardProcessId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: AwardProcessModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: AwardProcessModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_award_process' });
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
      awardProcessId: [null],
      employeeId: [null, [Validators.required]],
      awardFormId: [null, [Validators.required, Validators.maxLength(50)]],
      awardYear: [null, [Validators.required]],
      documentNo: [null, [Validators.maxLength(50)]],
      documentSignedDate: [null],
      listAttributes: this.fb.array([])
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  afterPatchValue() {
    super.afterPatchValue();
    this.f.awardYear.setValue(Utils.convertDateToFillForm(this.data.awardYear, 'yyyy'));
  }

  beforeSave() {
    this.body.awardYear = Utils.convertDateToSendServer(this.f.awardYear.value, 'yyyy');
    this.body.documentSignedDate = Utils.convertDateToSendServer(this.f.documentSignedDate.value);
  }
}

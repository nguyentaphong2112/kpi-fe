import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { EducationPromotionsService } from '@app/modules/hrm/data-access/services/staff-research/education-promotions.service';
import { EducationPromotionsModel } from '@app/modules/hrm/data-access/models/research/education-promotions.model';
import { Utils } from '@core/utils/utils';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';

@Component({
  selector: 'app-epn-form',
  templateUrl: './epn-form.component.html',
  styleUrls: ['./epn-form.component.scss']
})
export class EpnFormComponent extends BaseFormComponent<EducationPromotionsModel> implements OnInit {
  hiddenEmp = false;
  employeeId: number;
  functionCode = FunctionCode.HR_EDUCATION_PROMOTIONS;
  scope = Scopes.CREATE;

  constructor(
    private readonly service: EducationPromotionsService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'educationPromotionId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: EducationPromotionsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: EducationPromotionsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({tableName: 'hr_education_promotions'});
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
      educationPromotionId: [null],
      employeeId: [null, [Validators.required]],
      promotionRankId: [null, [Validators.required]],
      issuedYear: [null, [Validators.required]],
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  beforeSave() {
    this.body.issuedYear = Utils.convertDateToSendServer(this.f.issuedYear.value, 'yyyy');
  }

  afterPatchValue() {
    super.afterPatchValue();
    this.f.issuedYear.setValue(Utils.convertDateToFillForm(this.data.issuedYear, 'yyyy'));
  }
}


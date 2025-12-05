import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from "@angular/forms";
import {InsuranceRetractionsModel} from "../../../../data-access/models/caculate/insurance-retractions.model";
import {InsuranceRetractionsService} from "../../../../data-access/services/caculate/insurance-retractions.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";

@Component({
  selector: 'irs-form',
  templateUrl: './irs-form.component.html',
  styleUrls: ['./irs-form.component.scss']
})
export class sFormComponent extends BaseFormComponent<InsuranceRetractionsModel> implements OnInit {

  serviceName = MICRO_SERVICE.ICN
  urlLoadData = '/insurance-retractions'
  constructor(
    private readonly service: InsuranceRetractionsService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'insuranceRetractionId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: InsuranceRetractionsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: InsuranceRetractionsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      insuranceRetractionId: [null],
      periodDate: [null, [Validators.required]],
      employeeId: [null, [Validators.required]],
      empTypeCode: [null, [Validators.required, Validators.maxLength(50)]],
      labourType: [null, [Validators.required, Validators.maxLength(200)]],
      jobId: [null, [Validators.required]],
      orgId: [null, [Validators.required]],
      contractSalary: [null, [Validators.required]],
      reserveSalary: [null, [Validators.required]],
      posAllowanceSalary: [null, [Validators.required]],
      senioritySalary: [null, [Validators.required]],
      posSenioritySalary: [null, [Validators.required]],
      totalSalary: [null, [Validators.required]],
      perSocialAmount: [null, [Validators.required]],
      unitSocialAmount: [null, [Validators.required]],
      perMedicalAmount: [null, [Validators.required]],
      unitMedicalAmount: [null, [Validators.required]],
      perUnempAmount: [null, [Validators.required]],
      unitUnempAmount: [null, [Validators.required]],
      unitUnionAmount: [null, [Validators.required]],
      baseUnionAmount: [null, [Validators.required]],
      superiorUnionAmount: [null, [Validators.required]],
      modUnionAmount: [null, [Validators.required]],
      status: [null, [Validators.required, Validators.maxLength(50)]],
      reason: [null, [Validators.required, Validators.maxLength(255)]],
      note: [null, [Validators.required, Validators.maxLength(1000)]],
      insuranceFactor: [null, [Validators.required]],
      insuranceBaseSalary: [null, [Validators.required]],
      reserveFactor: [null, [Validators.required]],
      allowanceFactor: [null, [Validators.required]],
      seniorityPercent: [null, [Validators.required]],
      posSeniorityPercent: [null, [Validators.required]],
      insuranceTimekeeping: [null, [Validators.required]],
      leaveTimekeeping: [null, [Validators.required]],
      leaveReason: [null, [Validators.required, Validators.maxLength(255)]],
      maternityTimekeeping: [null, [Validators.required]],
      insuranceAgency: [null, [Validators.required, Validators.maxLength(255)]],
      type: [null, [Validators.required]],
      rejectReason: [null, [Validators.required, Validators.maxLength(500)]],
      totalAmount: [null, [Validators.required]],
      retroPeriodDate: [null, [Validators.required]],
      insuranceContributionId: [null, [Validators.required]],
      tableType: [null, [Validators.required]],
      baseId: [null, [Validators.required]],
      retirementSocialAmount: [null, [Validators.required]],
      sicknessSocialAmount: [null, [Validators.required]],
      accidentSocialAmount: [null, [Validators.required]],
      fileList: [null]

    },
    {validators:
        []
    });
  }
}



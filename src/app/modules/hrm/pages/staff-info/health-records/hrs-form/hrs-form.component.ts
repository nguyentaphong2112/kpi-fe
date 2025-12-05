import {Component, Injector, OnInit} from '@angular/core';
import {FormArray, Validators} from "@angular/forms";
import {HealthRecordsModel} from "../../../../data-access/models/staff-info/health-records.model";
import {HealthRecordsService} from "../../../../data-access/services/staff-info/health-records.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {DataService} from "@shared/services/data.service";

@Component({
  selector: 'hrs-form',
  templateUrl: './hrs-form.component.html',
  styleUrls: ['./hrs-form.component.scss']
})
export class sFormComponent extends BaseFormComponent<HealthRecordsModel> implements OnInit {

  serviceName = MICRO_SERVICE.HRM
  urlLoadData = '/health-records'
  microService = MICRO_SERVICE;
  constructor(
    private readonly service: HealthRecordsService,
    private readonly dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'healthRecordId'

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: HealthRecordsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: HealthRecordsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'hr_health_records',
    });
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
      healthRecordId: [null],
      employeeId: [null, [Validators.required]],
      examinationPeriodId: [null, [Validators.required, Validators.maxLength(20)]],
      examinationDate: [null, [Validators.required]],
      resultId: [null, [Validators.required, Validators.maxLength(20)]],
      diseaseIds: [null, [Validators.maxLength(255)]],
      patientId: [null],
      listAttributes: this.fb.array([])
    },
    {validators:
        []
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  beforePatchValue() {
    super.beforePatchValue();
    if (typeof this.data.diseaseIds === "string") {
      this.data.diseaseIds = this.data.diseaseIds.split(",")
    }
  }

  beforeSave() {
    super.beforeSave();
    if (this.body.diseaseIds && typeof this.body.diseaseIds !== "string") {
      this.body.diseaseIds = this.body.diseaseIds.join(",")
    }
  }

}



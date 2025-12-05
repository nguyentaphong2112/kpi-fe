import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { FamilyRelationshipsModel } from '@app/modules/hrm/data-access/models/research/family-relationships.model';
import { FamilyRelationshipsService } from '@app/modules/hrm/data-access/services/staff-research/family-relationships.service';
import { HTTP_STATUS_CODE, SYSTEM_FORMAT_DATA } from '@core/constant/system.constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { Utils } from '@core/utils/utils';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';

@Component({
  selector: 'app-frp-form',
  templateUrl: './frp-form.component.html',
  styleUrls: ['./frp-form.component.scss']
})
export class FrpFormComponent extends BaseFormComponent<FamilyRelationshipsModel> implements OnInit {
  hiddenEmp = false;
  data: any;
  employeeId: number;
  listTypeDate: CategoryModel[] = [];
  functionCode = FunctionCode.HR_FAMILY_RELATIONSHIP;
  scope = Scopes.CREATE;

  constructor(
    private readonly service: FamilyRelationshipsService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
    this.key = 'familyRelationshipId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: FamilyRelationshipsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: FamilyRelationshipsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_family_relationships' });
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getListTypeDate();
    this.employeeId = this.data?.employeeId;
    if (this.employeeId && this.mode === Mode.ADD) {
      this.form.controls.employeeId.setValue(this.employeeId);
    }
    this.hiddenEmp = this.data.hiddenEmp;
  }

  override initForm() {
    this.form = this.fb.group({
      familyRelationshipId: [null],
      employeeId: [null, [Validators.required]],
      relationTypeId: [null, [Validators.required, Validators.maxLength(50)]],
      fullName: [null, [Validators.required, Validators.maxLength(255)]],
      relationStatusId: [null, [Validators.required, Validators.maxLength(50)]],
      policyTypeId: [null, [Validators.maxLength(50)]],
      dateOfBirth: [null],
      job: [null],
      organizationAddress: [null],
      currentAddress: [null],
      personalIdNo: [null],
      mobileNumber: [null],
      typeDateOfBirth: ['DATE'],
      listAttributes: this.fb.array([])
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  getListTypeDate() {
    this.subscriptions.push(
      this.dataService.getData(this.getUrlCategory(this.categoryCode.KIEU_THOI_GIAN), this.microService.ADMIN, true).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listTypeDate = res.data;
        }
      })
    );
  }

  beforeSave() {
    if (!this.f.typeDateOfBirth.value) {
      this.body.typeDateOfBirth = 'DATE';
    }
    this.body.dateOfBirthStr = Utils.convertDateToSendServer(this.body.dateOfBirth, this.getTypeFormatDate(this.f.typeDateOfBirth.value));
  }

  getTypeFormatDate(data: string): string {
    let type = SYSTEM_FORMAT_DATA.DATE_FORMAT;
    if (data?.toUpperCase() === 'MONTH') {
      type = SYSTEM_FORMAT_DATA.MONTH_TIME_FORMAT;
    } else if (data?.toUpperCase() === 'YEAR') {
      type = SYSTEM_FORMAT_DATA.YEAR_TIME_FORMAT;
    }
    return type;
  }
}

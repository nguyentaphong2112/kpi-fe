import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { PersonalIdentitiesModel } from '@app/modules/hrm/data-access/models/research/personal-identities.model';
import { FormArray, Validators } from '@angular/forms';
import { DateValidator } from '@app/shared/custom-validator/dateValidator.class';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import {
  PersonalIdentitiesService
} from '@app/modules/hrm/data-access/services/staff-research/personal-identities.service';
import { CategoryModel } from '@core/models/category-common.interface';
import { forkJoin, of } from 'rxjs';
import { HTTP_STATUS_CODE } from '@app/core/constant/system.constants';
import { catchError, map } from 'rxjs/operators';
import { SelectModal } from '@shared/component/hbt-select/select.component';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Scopes } from '@core/utils/common-constants';

@Component({
  selector: 'app-piy-form',
  templateUrl: './piy-form.component.html',
  styleUrls: ['./piy-form.component.scss']
})
export class PiyFormComponent extends BaseFormComponent<PersonalIdentitiesModel> implements OnInit {
  constant = Constant;
  listCitizenPlace: CategoryModel[] = [];
  listIdNoPlace: CategoryModel[] = [];
  listIdentityType: CategoryModel[] = [];
  Constant;
  employeeId: number;
  hiddenEmp = false;
  validateIdNo = { isDisabledAppNumberInput: false, validateIdNoLength: null, identityTypeName: '' };
  functionCode = FunctionCode.HR_PERSONAL_IDENTITIES;
  scope = Scopes.CREATE;

  constructor(
    private readonly service: PersonalIdentitiesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.initDataSelect();
    this.initForm();
    this.key = 'personalIdentityId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: PersonalIdentitiesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: PersonalIdentitiesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'hr_personal_identities' });
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

  initForm() {
    this.form = this.fb.group({
      employeeId: [null, this.mode === this.modeConst.ADD ? [Validators.required] : []],
      identityTypeId: [null, [Validators.required]],
      identityNo: [null, [Validators.required]],
      identityIssuePlace: [null, [Validators.required]],
      isMain: [null],
      identityIssueDate: [null, [Validators.required]],
      expiredDate: [null],
      personalIdentityId: [null],
      listAttributes: this.fb.array([])
    }, {
      validators: DateValidator.validateRangeDate('identityIssueDate', 'expiredDate', 'rangeDateError')
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  changeIdentityType(event: SelectModal) {
    this.validateIdNo.identityTypeName = event?.itemSelected?.name;
    const identityTypeValue = event?.itemSelected?.value;
    let listData: any[] = [];
    this.validateIdNo.validateIdNoLength = null;
    if (this.validateIdNo.isDisabledAppNumberInput) {
      this.f.identityNo.reset();
    }
    this.validateIdNo.isDisabledAppNumberInput = false;
    if (identityTypeValue === this.constant.PAPERS_CODE.ID_NO) {
      listData = this.listIdNoPlace;
      this.validateIdNo.validateIdNoLength = 9;
    } else if (identityTypeValue === this.constant.PAPERS_CODE.CITIZEN_ID) {
      listData = this.listCitizenPlace;
      this.validateIdNo.validateIdNoLength = 12;
    } else {
      this.validateIdNo.isDisabledAppNumberInput = true;
    }
    if (this.validateIdNo.validateIdNoLength) {
      this.f.identityNo.setValidators([Validators.required, Validators.minLength(this.validateIdNo.validateIdNoLength), Validators.maxLength(this.validateIdNo.validateIdNoLength)]);
    } else {
      this.f.identityNo.setValidators([Validators.required]);
    }
    this.f.identityNo.updateValueAndValidity();
    if ((listData.length > 0 || !identityTypeValue) && !listData.some(item => item.name === this.f.identityIssuePlace.value)) {
      this.f.identityIssuePlace.reset();
    }
  }

  beforePatchValue() {
    this.data.isMain = this.data.isMain === 'Y';
  }

  beforeSave() {
    this.body.isMain = this.f.isMain.value ? 'Y' : null;
  }

  afterPatchValue() {
    super.afterPatchValue();
    this.f.identityTypeId.setValue(this.data.identityTypeId);
    this.f.identityNo.setValue(this.data.identityNo);
  }

  initDataSelect() {
    const typeCodes = [this.categoryCode.NOI_CAP_CMT, this.categoryCode.NOI_CAP_CCCD, this.categoryCode.LOAI_GIAY_TO];
    const listRequest = typeCodes.map(item => {
      return this.dataService.getData(this.getUrlCategory(item), this.microService.ADMIN)
        .pipe(map((res) => res), catchError(() => of(null)));
    });
    this.subscriptions.push(
      forkJoin(listRequest).subscribe(res => {
        if (res && res[0]?.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listIdNoPlace = res[0].data;
        }
        if (res && res[1]?.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listCitizenPlace = res[1].data;
        }

        if (res && res[2]?.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listIdentityType = res[2].data;
        }
      })
    );
  }
}

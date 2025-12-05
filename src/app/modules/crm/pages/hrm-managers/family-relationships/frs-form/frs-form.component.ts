import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { FamilyRelationshipsModel } from '../../../../data-access/models/hrm-managers/family-relationships.model';
import { FamilyRelationshipsService } from '../../../../data-access/services/hrm-managers/family-relationships.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { Utils } from '@core/utils/utils';
import { format } from 'date-fns';
import { distinctUntilChanged } from 'rxjs';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { CategoryModel } from '@core/models/category-common.interface';
import { DataService } from '@shared/services/data.service';
import { CustomValidators } from '@core/utils/custom-validations';

@Component({
  selector: 'frs-form',
  templateUrl: './frs-form.component.html',
  styleUrls: ['./frs-form.component.scss']
})
export class FrsFormComponent extends BaseFormComponent<FamilyRelationshipsModel> implements OnInit {
  listProvinces: CategoryModel[] = [];
  listDistricts: CategoryModel[] = [];
  listWards: CategoryModel[] = [];
  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = '/family-relationships';
  @Input() type: Mode;

  constructor(
    private readonly service: FamilyRelationshipsService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'familyRelationshipId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: FamilyRelationshipsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: FamilyRelationshipsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'crm_family_relationships'
    });
    this.getConfigAttributes(true);
  }

  override initForm() {
    this.form = this.fb.group({
        familyRelationshipId: [null],
        objectType: [null],
        objectId: [null],
        relationTypeId: [null, [Validators.required, Validators.maxLength(20)]],
        relationTypeName: [null],
        dateOfBirth: [null, [Validators.required]],
        fullName: [null, [Validators.required, Validators.maxLength(255)]],
        mobileNumber: [null, [Validators.maxLength(10), CustomValidators.phoneMobileVN]],
        email: [null, [Validators.maxLength(255), Validators.email]],
        zaloAccount: [null, [Validators.maxLength(255)]],
        facebookAccount: [null, [Validators.maxLength(255)]],
        relationStatusId: [null],
        job: [null],
        departmentName: [null],
        provinceId: [null, [Validators.maxLength(20)]],
        districtId: [null, [Validators.maxLength(20)]],
        wardId: [null, [Validators.maxLength(20)]],
        villageAddress: [null, [Validators.maxLength(255)]],
        listAttributes: this.fb.array([])
      },
      {
        validators:
          []
      });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  ngOnInit() {
    super.ngOnInit();
    this.initForm();
    this.getListProvinces();
    this.onChangeAddressValue();
    this.initData();
  }

  override initData() {
    if (this.data) {
      this.form.patchValue(this.data);
      this.form.get('dateOfBirth').setValue(Utils.convertDateToFillForm(this.data.dateOfBirth));
    }
  }

  override save() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = { ...this.form.value };
    const dateOfBirthValue = this.form.get('dateOfBirth')?.value;
    if (dateOfBirthValue) {
      data.dateOfBirth = format(dateOfBirthValue, 'dd/MM/yyyy');
    }
    this.modalRef.close({ data });
  }


  changeValue(event, formControlName: string) {
    this.f[formControlName].setValue(event?.itemSelected?.name);
  }

  onChangeAddressValue() {
    this.subscriptions.push(
      this.f.provinceId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        if (value) {
          this.changeProvince(value, 'HK');
        } else {
          this.listDistricts = [];
          this.listWards = [];
          this.f.districtId.reset();
          this.f.wardId.reset();
        }
      })
    );
    this.subscriptions.push(
      this.f.districtId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        if (value) {
          this.changeDistrict(value, 'HK');
        } else {
          this.listWards = [];
          this.f.wardId.reset();
        }
      })
    );
  }

  getListProvinces() {
    const url = this.getUrlCategory(this.categoryCode.TINH);
    this.subscriptions.push(
      this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listProvinces = res.data;
        }
      })
    );
  }

  changeProvince(value: string | number, type: 'HK' | 'HT') {
    if (value) {
      const url = UrlConstant.CATEGORY_ADDRESS.GET_DISTRICT + `/${value}`;
      this.subscriptions.push(
        this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            if (type === 'HK') {
              this.listDistricts = res.data;
              if (!this.listDistricts.some(item => item.value === this.f.districtId.value)) {
                this.f.districtId.reset();
                this.f.wardId.reset();
              }
            }
          }
        })
      );
    }
  }

  changeDistrict(value: number, type: 'HK' | 'HT') {
    if (value) {
      const url = UrlConstant.CATEGORY_ADDRESS.GET_WARDS + `/${value}`;
      this.subscriptions.push(
        this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            if (type === 'HK') {
              this.listWards = res.data;
              if (!this.listWards.some(item => item.value === this.f.wardId.value)) {
                this.f.wardId.reset();
              }
            }
          }
        })
      );
    }
  }
}



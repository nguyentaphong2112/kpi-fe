import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { ContactAddressModels, EmployeesModel } from '@app/modules/hrm/data-access/models/research/employees.model';
import { PersonalInfoService } from '@app/modules/hrm/data-access/services/staff-research/personal-info.service';
import { CategoryModel } from '@core/models/category-common.interface';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { distinctUntilChanged } from 'rxjs';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { StringUtils } from '@shared/utils/string-utils.class';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { environment } from '@env/environment';

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent extends BaseFormComponent<EmployeesModel> implements OnInit {
  listProvinces: CategoryModel[] = [];
  listDistricts: CategoryModel[] = [];
  listWards: CategoryModel[] = [];
  listCurrentDistricts: CategoryModel[] = [];
  listCurrentWards: CategoryModel[] = [];
  requiredLabel = ' <span class=\'label__required\'>*</span>';
  isRequiredTaxNo = environment.isRequiredTaxNo;

  constructor(
    private readonly service: PersonalInfoService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.initForm();
    this.key = 'employeeId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: EmployeesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: EmployeesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'hr_employees',
      functionCode: 'THONG_TIN_CO_BAN'
    });
    this.getConfigAttributes();
  }

  ngOnInit() {
    this.data.employeeId = this.config ? this.config : this.data.employeeId;
    super.ngOnInit();
    this.getListProvinces();
    this.onChangeAddressValue();
  }

  initForm() {
    this.form = this.fb.group({
      ethnicId: [null, Validators.required],
      religionId: [null, Validators.required],
      maritalStatusId: [null, Validators.required],
      email: [null, Validators.email],
      mobileNumber: [null, [Validators.required]],
      insuranceNo: [null, Validators.maxLength(10)],
      taxNo: [null, this.isRequiredTaxNo ? [Validators.required, Validators.minLength(10), Validators.maxLength(10)] : null],
      placeOfBirth: [null, Validators.maxLength(500)],
      dateOfBirth: [null, Validators.required],
      originalAddress: [null, Validators.maxLength(255)],
      educationLevelId: [null, Validators.required],
      provinceId: [null],
      // districtId: [null],
      wardId: [null],
      villageAddress: [null],
      currentProvinceId: [null],
      // currentDistrictId: [null],
      currentWardId: [null],
      currentVillageAddress: [null],
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  beforePatchValue() {
    if (this.data.listContactAddresses?.length > 0) {
      const curAddressInfo = this.data.listContactAddresses.find(item => item.addressType?.toUpperCase() === Constant.ADDRESS_TYPES.HIEN_TAI);
      if (curAddressInfo) {
        this.data.currentProvinceId = curAddressInfo.provinceId;
        // this.data.currentDistrictId = curAddressInfo.districtId;
        this.data.currentWardId = curAddressInfo.wardId;
        this.data.currentVillageAddress = curAddressInfo.villageAddress;
      }

      const addressInfo = this.data.listContactAddresses.find(item => item.addressType?.toUpperCase() === Constant.ADDRESS_TYPES.THUONG_TRU);
      if (addressInfo) {
        this.data.provinceId = addressInfo.provinceId;
        // this.data.districtId = addressInfo.districtId;
        this.data.wardId = addressInfo.wardId;
        this.data.villageAddress = addressInfo.villageAddress;
      }
    }
  }

  onChangeAddressValue() {
    this.subscriptions.push(
      this.f.provinceId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        if (value) {
          this.changeProvince(value, 'HK');
        } else {
          // this.listDistricts = [];
          this.listWards = [];
          // this.f.districtId.reset();
          this.f.wardId.reset();
        }
      })
    );

    this.subscriptions.push(
      this.f.currentProvinceId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        if (value) {
          this.changeProvince(value, 'HT');
        } else {
          // this.listCurrentDistricts = [];
          this.listWards = [];
          // this.f.currentDistrictId.reset();
          this.f.currentWardId.reset();
        }
      })
    );

    // this.subscriptions.push(
    //   this.f.districtId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
    //     if (value) {
    //       this.changeDistrict(value, 'HK');
    //     } else {
    //       this.listWards = [];
    //       this.f.wardId.reset();
    //     }
    //   })
    // );
    //
    // this.subscriptions.push(
    //   this.f.currentDistrictId.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
    //     if (value) {
    //       this.changeDistrict(value, 'HT');
    //     } else {
    //       this.listWards = [];
    //       this.f.currentWardId.reset();
    //     }
    //   })
    // );
  }

  getListProvinces() {
    const url = this.getUrlCategory(this.categoryCode.TINH) + "?isActive=true";
    this.subscriptions.push(
      this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listProvinces = res.data;
        }
      })
    );
  }

  changeProvince(value: number, type: 'HK' | 'HT') {
    if (value) {
      const url = UrlConstant.CATEGORY_ADDRESS.GET_WARD_BY_PROVINCE + `/${value}` + '?isActive=true';
      this.subscriptions.push(
        this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            if (type === 'HK') {
              this.listWards = res.data;
              if (!this.listWards.some(item => item.value === this.f.wardId.value)) {
                this.f.wardId.reset();
              }
            } else {
              this.listCurrentWards = res.data;
              if (!this.listCurrentWards.some(item => item.value === this.f.currentWardId.value)) {
                this.f.currentWardId.reset();
              }
            }
          }
        })
      );
    }
  }

  // changeProvince(value: string | number, type: 'HK' | 'HT') {
  //   if (value) {
  //     const url = UrlConstant.CATEGORY_ADDRESS.GET_DISTRICT + `/${value}`;
  //     this.subscriptions.push(
  //       this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
  //         if (res.code === HTTP_STATUS_CODE.SUCCESS) {
  //           if (type === 'HK') {
  //             this.listDistricts = res.data;
  //             if (!this.listDistricts.some(item => item.value === this.f.districtId.value)) {
  //               this.f.districtId.reset();
  //               this.f.wardId.reset();
  //             }
  //           } else {
  //             this.listCurrentDistricts = res.data;
  //             if (!this.listCurrentDistricts.some(item => item.value === this.f.currentDistrictId.value)) {
  //               this.f.currentDistrictId.reset();
  //               this.f.currentWardId.reset();
  //             }
  //           }
  //         }
  //       })
  //     );
  //   }
  // }

  // changeDistrict(value: number, type: 'HK' | 'HT') {
  //   if (value) {
  //     const url = UrlConstant.CATEGORY_ADDRESS.GET_WARDS + `/${value}`;
  //     this.subscriptions.push(
  //       this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
  //         if (res.code === HTTP_STATUS_CODE.SUCCESS) {
  //           if (type === 'HK') {
  //             this.listWards = res.data;
  //             if (!this.listWards.some(item => item.value === this.f.wardId.value)) {
  //               this.f.wardId.reset();
  //             }
  //           } else {
  //             this.listCurrentWards = res.data;
  //             if (!this.listCurrentWards.some(item => item.value === this.f.currentWardId.value)) {
  //               this.f.currentWardId.reset();
  //             }
  //           }
  //         }
  //       })
  //     );
  //   }
  // }

  beforeSave() {
    this.body.listContactAddresses = this.getContactAddresses();
  }

  getContactAddresses(): ContactAddressModels[] {
    const addressRequests: ContactAddressModels[] = [];
    if (!StringUtils.isNullOrEmpty(this.f.provinceId.value) || !StringUtils.isNullOrEmpty(this.f.villageAddress.value)) {
      addressRequests.push({
        provinceId: this.f.provinceId.value,
        // districtId: this.f.districtId.value,
        wardId: this.f.wardId.value,
        villageAddress: this.f.villageAddress.value,
        addressType: Constant.ADDRESS_TYPES.THUONG_TRU
      });
    }

    if (!StringUtils.isNullOrEmpty(this.f.currentProvinceId.value) || !StringUtils.isNullOrEmpty(this.f.currentVillageAddress.value)) {
      addressRequests.push({
        provinceId: this.f.currentProvinceId.value,
        // districtId: this.f.currentDistrictId.value,
        wardId: this.f.currentWardId.value,
        villageAddress: this.f.currentVillageAddress.value,
        addressType: Constant.ADDRESS_TYPES.HIEN_TAI
      });
    }
    return addressRequests;
  }
}

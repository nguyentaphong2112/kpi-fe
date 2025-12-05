import {Component, Injector, OnInit} from '@angular/core';
import {FormArray, Validators} from "@angular/forms";
import {PartnersModel} from "../../../../data-access/models/category-managers/partners.model";
import {PartnersService} from "../../../../data-access/services/category-managers/partners.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {HTTP_STATUS_CODE, MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {distinctUntilChanged} from "rxjs";
import {UrlConstant} from "@app/modules/hrm/data-access/constant/url.class";
import {CategoryModel} from "@core/models/category-common.interface";
import {DataService} from "@shared/services/data.service";

@Component({
  selector: 'partners-form',
  templateUrl: './partners-form.component.html',
  styleUrls: ['./partners-form.component.scss']
})
export class PartnersFormComponent extends BaseFormComponent<PartnersModel> implements OnInit {
  listProvinces: CategoryModel[] = [];
  listDistricts: CategoryModel[] = [];
  listWards: CategoryModel[] = [];
  serviceName = MICRO_SERVICE.CRM
  urlLoadData = '/partners'
  constructor(
    private readonly service: PartnersService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'partnerId'
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: PartnersModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: PartnersModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);

    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'crm_products',
    });
    this.getConfigAttributes();

  }

  override initForm() {
    this.form = this.fb.group({
      partnerId: [null],
      fullName: [null, [Validators.required, Validators.maxLength(255)]],
      dateOfBirth: [null],
      genderId:[null],
      mobileNumber: [null, [Validators.required, Validators.pattern(/^(03|05|07|08|09|02[0-9])[0-9]{0,10}$/)]],
      zaloAccount: [null, [Validators.maxLength(255)]],
      email: [null, [Validators.maxLength(255), Validators.email]],
      partnerType: [null, [Validators.maxLength(20)]],
      villageAddress: [null, [Validators.maxLength(255)]],
      job: [null, [Validators.maxLength(100)]],
      departmentName: [null, [Validators.maxLength(100)]],
      provinceId: [null],
      districtId: [null],
      wardId: [null],
      bankAccount: [null, [Validators.maxLength(50)]],
      bankName: [null, [Validators.maxLength(255)]],
      bankBranch: [null, [Validators.maxLength(255)]],
      listAttributes: this.fb.array([]),
    },
    {validators:
        []
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  ngOnInit() {
    super.ngOnInit();
    this.getListProvinces();
    this.onChangeAddressValue();
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



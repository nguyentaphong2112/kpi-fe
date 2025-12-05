import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { CustomersModel } from '../../../../data-access/models/order-managers/customers.model';
import { CustomersService } from '../../../../data-access/services/order-managers/customers.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { DataService } from '@shared/services/data.service';
import { FamilyRelationshipsModel } from '@app/modules/crm/data-access/models/hrm-managers/family-relationships.model';
import { FrsFormComponent } from '@app/modules/crm/pages/hrm-managers/family-relationships/frs-form/frs-form.component';
import { distinctUntilChanged } from 'rxjs';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { CategoryModel } from '@core/models/category-common.interface';
import { EmployeesInfo } from '@app/modules/hrm/data-access/models/employee-info';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Utils } from '@core/utils/utils';
import { EmployeesService } from '@app/modules/crm/data-access/services/hrm-managers/employees.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { CustomValidators } from '@core/utils/custom-validations';

@Component({
  selector: 'customers-form',
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss']
})
export class CustomersFormComponent extends BaseFormComponent<CustomersModel> implements OnInit {
  isDisabledValue = true;
  listProvinces: CategoryModel[] = [];
  listDistricts: CategoryModel[] = [];
  listWards: CategoryModel[] = [];
  employeesInfo: EmployeesInfo | NzSafeAny;

  isFocus = false;
  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = '/customers';
  listFamilyRelationshipData: FamilyRelationshipsModel[] = [];
  familyRelationshipData: FamilyRelationshipsModel;
  addWidth = 0;
  fmsModalRef: NzModalRef;
  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;

  constructor(
    private readonly service: CustomersService,
    private readonly serviceEmployee: EmployeesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'customerId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: CustomersModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: CustomersModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'crm_customers'
    });
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
        customerId: [null],
        fullName: [null, [Validators.required, Validators.maxLength(255)]],
        mobileNumber: [null, [Validators.required]],
        loginName: [null, [Validators.maxLength(255)]],
        password: [123456, [Validators.required, Validators.maxLength(50)]],
        genderId: [null, [Validators.maxLength(20)]],
        dateOfBirth: [null],
        email: [null, [Validators.maxLength(255), Validators.email]],
        zaloAccount: [null, [Validators.maxLength(255)]],
        introducerId: [null],
        userTakeCareId: [null],
        receiverId: [null],
        job: [null, [Validators.maxLength(255)]],
        departmentName: [null, [Validators.maxLength(255)]],
        provinceId: [null, [Validators.maxLength(20)]],
        districtId: [null, [Validators.maxLength(20)]],
        wardId: [null, [Validators.maxLength(20)]],
        villageAddress: [null, [Validators.maxLength(255)]],
        bankAccount: [null, [Validators.maxLength(255)]],
        bankName: [null, [Validators.maxLength(255)]],
        bankBranch: [null, [Validators.maxLength(255)]],
        status: [null, [Validators.maxLength(255)]],
        listFamilyRelationship: [null],
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
    this.fmsModalRef = this.modalRef;
    this.getListProvinces();
    this.onChangeAddressValue();
    this.getPersonalInfo();
  }

  doOpenForm(type?: Mode, index?: number) {
    let data = type === Mode.EDIT ? this.listFamilyRelationshipData[index] : null;
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() + (this.addWidth ? this.addWidth : 0),
      nzTitle: this.getModeTitle(type),
      nzContent: FrsFormComponent,
      nzComponentParams: {
        mode: type,
        data: data
      },
      nzFooter: this.footerTpl,
      nzClosable: true
    });
    this.modalRef.afterClose.subscribe((result) => {
      this.modalRef = this.fmsModalRef;
      if (result?.data) {
        this.familyRelationshipData = result.data;
        if (type === Mode.EDIT) {
          this.listFamilyRelationshipData[index] = { ...result.data };
        } else {
          this.listFamilyRelationshipData.push(this.familyRelationshipData);
        }
      }
    });
  }

  getPersonalInfo() {
    this.serviceEmployee.getListEmployee(null).subscribe((res: any) => {
      this.employeesInfo = res.data;
    });
  }

  removeFamilyRelationship(index: number) {
    if (this.listFamilyRelationshipData.length > 0) {
      this.listFamilyRelationshipData.splice(index, 1);
    }
  }

  override afterPatchValue() {
    super.afterPatchValue();
    if (this.data) {
      this.listFamilyRelationshipData = this.data.listFamilyRelationship.map(item => {
        if (item.dateOfBirth && item.dateOfBirth instanceof Date) {
          item.dateOfBirth = Utils.convertDateToSendServer(item.dateOfBirth);
        }
        return item;
      });
    }
  }

  beforeSave() {
    super.beforeSave();
    this.listFamilyRelationshipData.forEach(it => {
      it[this.keyAttributeData]?.forEach((item: any) => {
        if (item.dataType === 'MULTI_LIST') {
          item.attributeValue = item.attributeValue?.join(',');
        }
      });
    });
    this.body.listFamilyRelationship = this.listFamilyRelationshipData;
  }

  onLabelClick() {
    this.isFocus = !this.isFocus;
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

  protected readonly Mode = Mode;
}



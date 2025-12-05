import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { OrdersModel } from '../../../../data-access/models/order-managers/orders.model';
import { OrdersService } from '../../../../data-access/services/order-managers/orders.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE, STORAGE_NAME } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CategoryModel } from '@core/models/category-common.interface';
import { UrlConstant } from '@app/modules/crm/data-access/constants/url.class';
import { DataService } from '@shared/services/data.service';
import { Constant } from '@app/modules/crm/data-access/constants/constants';
import { CustomValidators } from '@core/utils/custom-validations';
import { SelectModal } from '@shared/component/hbt-select/select.component';
import { IHbtOption } from '@core/models/IOption';
import { PaymentsModel } from '@app/modules/crm/data-access/models/order-managers/payments.model';
import {
  PaymentsFormComponent
} from '@app/modules/crm/pages/order-managers/orders/payments-form/payments-form.component';
import { UserLogin } from '@shared/model/user-login';
import { StorageService } from '@core/services/storage.service';
import { EmployeesService } from '@app/modules/crm/data-access/services/hrm-managers/employees.service';
import { EmployeesModel } from '@app/modules/crm/data-access/models/hrm-managers/employees.model';

@Component({
  selector: 'orders-form',
  templateUrl: './orders-form.component.html',
  styleUrls: ['./orders-form.component.scss']
})
export class OrdersFormComponent extends BaseFormComponent<OrdersModel> implements OnInit {

  userLogin: UserLogin = new UserLogin();
  employeeInfo: EmployeesModel | NzSafeAny;
  payments: PaymentsModel[] = [];
  paymentIds: number[] = [];
  totalAmount = 0;
  discountAmount = 0;
  finalAmount = 0;
  taxAmount = 0;
  isDisabledValue = true;

  discountType: IHbtOption<string>[] = [
    {
      label: 'Phần trăm',
      value: 'PHAN_TRAM'
    },
    {
      label: 'Cố định',
      value: 'CO_DINH'
    }
  ];
  listProvinces: CategoryModel[] = [];
  listDistricts: CategoryModel[] = [];
  listWards: CategoryModel[] = [];
  orderDetailIds: number[] = [];
  serviceName = MICRO_SERVICE.CRM;

  readonly FORM_ARRAY_NAME = 'orderDetails';

  constructor(
    private readonly service: OrdersService,
    private readonly serviceEmployee: EmployeesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'orderId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: OrdersModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: OrdersModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'crm_orders',
      functionCode: Constant.FUNCTION_CODE.CRM_ORDERS
    });
    this.getConfigAttributes();
    this.getListProvinces();
  }

  ngOnInit() {
    this.userLogin = StorageService.get(STORAGE_NAME.USER_LOGIN);
    super.ngOnInit();
    this.getEmployeeInfo();
  }

  get orderDetails(): NzSafeAny {
    return this.form.controls[this.FORM_ARRAY_NAME] as FormArray;
  }

  getEmployeeInfo() {
    this.serviceEmployee.getListEmployee(null).subscribe((res: any) => {
      this.employeeInfo = res.data;
      const matchedEmployee = this.employeeInfo.find((emp: any) => emp.mobileNumber === this.userLogin.mobileNumber);
      if (matchedEmployee) {
        this.form.patchValue({
          saleStaffId: matchedEmployee.employeeId
        });
      }
    });
  }


  override initForm() {
    this.form = this.fb.group({
        orderId: [null],
        orderNo: [null],
        orderDate: [new Date(), [Validators.required]],
        saleStaffId: [null, [Validators.required]],
        discountCode: [null],
        customerId: [null, [Validators.required]],
        mobileNumber: [null, [CustomValidators.phoneMobileVN]],
        email: [null],
        provinceId: [null],
        districtId: [null],
        introducerId: [null],
        caregiverId: [null],
        wardId: [null],
        villageAddress: [null],
        taxRate: [null, [Validators.max(100)]],
        orderDetails: this.fb.array([]),
        listAttributes: this.fb.array([])
      },
      {
        validators:
          []
      });
    if (!this.data) {
      this.initOrderDetail();
    }
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  beforePatchValue() {
    this.payments = this.data.payments.map(el => ({
      ...el,
      paymentMethodName: el.paymentMethod === 'TIEN_MAT' ? 'Tiền mặt' : 'Chuyển khoản'
    }));
    for (const item of this.data.orderDetails) {
      this.initOrderDetail();
    }
  }

  override beforeSave() {
    this.body.orderDetailIds = this.orderDetailIds;
    this.body.totalAmount = 1;
    this.body.discountAmount = 1;
    this.body.finalAmount = this.finalAmount;
    this.body.taxAmount = this.taxAmount;
    this.body.paymentIds = this.paymentIds;
    this.body.payments = this.payments;
  }

  initOrderDetail = () => {
    const controlsConfig: any = {};
    controlsConfig.orderDetailId = [null];
    controlsConfig.orderId = [null];
    controlsConfig.productId = [null, Validators.required];
    controlsConfig.unitName = [null];
    controlsConfig.unitPrice = [null];
    controlsConfig.quantity = [null, Validators.required];
    controlsConfig.discountType = ['PHAN_TRAM'];
    controlsConfig.discount = [null, Validators.max(100)];
    controlsConfig.totalPrice = [null];
    const courses = this.fb.group(controlsConfig);
    this.orderDetails.push(courses);
  };
  add = () => {
    this.isSubmitted = false;
    this.initOrderDetail();
  };
  onDelete = (i: number, item: FormGroup) => {
    this.popupService.showModalConfirmDelete(() => {
      if (item.get('orderDetailId').value) {
        this.orderDetailIds.push(item.get('orderDetailId').value);
      }
      this.orderDetails.removeAt(i);
      if (this.orderDetails.length === 0) {
        this.initOrderDetail();
      }
    });
  };

  changeProduct(data: any, item: FormGroup) {
    if (data.itemSelected) {
      item.get('unitName').setValue(data.itemSelected.unitName);
      item.get('unitPrice').setValue(data.itemSelected.unitPrice);
    } else {
      item.get('unitName').setValue(null);
      item.get('unitPrice').setValue(null);
    }
  }

  calculate(item: FormGroup) {
    const unitPrice = item.get('unitPrice').value;
    const quantity = item.get('quantity').value;
    if (!unitPrice || !quantity) {
      item.get('totalPrice').setValue(null);
    } else {
      const discount = item.get('discount').value;
      if (discount) {
        const discountType = item.get('discountType').value;
        if (discountType === 'PHAN_TRAM') {
          item.get('discount').setValidators([Validators.max(100)]);
          item.get('totalPrice').setValue((unitPrice * quantity) - (unitPrice * quantity * discount / 100));
        } else {
          item.get('discount').setValidators([Validators.max(unitPrice * quantity)]);
          item.get('totalPrice').setValue((unitPrice * quantity) - discount);
        }
        item.get('discount').updateValueAndValidity();
      } else {
        item.get('totalPrice').setValue(unitPrice * quantity);
      }
    }
    this.totalAmount = 0;
    this.discountAmount = 0;
    this.finalAmount = 0;
    this.taxAmount = 0;
    for (const el of this.orderDetails.controls) {
      this.totalAmount += (el.get('unitPrice').value * el.get('quantity').value) || 0;
      this.finalAmount += el.get('totalPrice').value || 0;
    }
    this.discountAmount = this.totalAmount - this.finalAmount;
    const rate = this.f.taxRate.value;
    if (rate) {
      this.taxAmount = Math.round(this.finalAmount - this.finalAmount *100 /(100+rate));
    }
  }

  changeProvinceId(value: number, formControl?: FormGroup, isAction?: boolean) {
    if (value) {
      this.changeProvince(value, 'HK', formControl, isAction);
    } else {
      if (formControl) {
        formControl.get('listDistricts').setValue([]);
        formControl.get('listWards').setValue([]);
        if (isAction) {
          formControl.get('districtId').reset();
          formControl.get('wardId').reset();
        }
      } else {
        this.listDistricts = [];
        this.listWards = [];
        this.f.districtId.reset();
        this.f.wardId.reset();
      }
    }
  }

  changeDistrictId(value: number, formControl?: FormGroup, isAction?: boolean) {
    if (value) {
      this.changeDistrict(value, 'HK', formControl, isAction);
    } else {
      if (formControl) {
        formControl.get('listWards').setValue([]);
        if (isAction) {
          formControl.get('wardId').reset();
        }
      } else {
        this.listWards = [];
        this.f.wardId.reset();
      }
    }
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

  changeProvince(value: string | number, type: 'HK' | 'HT', formControl?: FormGroup, isAction?: boolean) {
    if (value) {
      const url = UrlConstant.CATEGORY_ADDRESS.GET_DISTRICT + `/${value}`;
      this.subscriptions.push(
        this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            if (type === 'HK') {
              if (formControl) {
                formControl.get('listDistricts').setValue(res.data);
                if (!this.listWards.some(item => item.value === formControl.get('districtId').value) && isAction) {
                  formControl.get('districtId').reset();
                  formControl.get('wardId').reset();
                }
              } else {
                this.listDistricts = res.data;
                if (!this.listDistricts.some(item => item.value === this.f.districtId.value)) {
                  this.f.districtId.reset();
                  this.f.wardId.reset();
                }
              }
            }
          }
        })
      );
    }
  }

  changeDistrict(value: number, type: 'HK' | 'HT', formControl?: FormGroup, isAction?: boolean) {
    if (value) {
      const url = UrlConstant.CATEGORY_ADDRESS.GET_WARDS + `/${value}`;
      this.subscriptions.push(
        this.dataService.getData(url, this.microService.ADMIN, true).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            if (type === 'HK') {
              if (formControl) {
                formControl.get('listWards').setValue(res.data);
                if (!this.listWards.some(item => item.value === formControl.get('wardId').value) && isAction) {
                  formControl.get('wardId').reset();
                }
              } else {
                this.listWards = res.data;
                if (!this.listWards.some(item => item.value === this.f.wardId.value)) {
                  this.f.wardId.reset();
                }
              }
            }
          }
        })
      );
    }
  }

  calculateTotal() {
    const rate = this.f.taxRate.value;
    if (rate) {
      this.taxAmount = Math.round(this.finalAmount - this.finalAmount * 100 / (100 + rate));
    } else {
      this.taxAmount = 0;
    }
  }

  changeCustomer(data: SelectModal) {
    if (data.itemSelected) {
      this.f.mobileNumber.setValue(data.itemSelected.mobileNumber);
      this.f.email.setValue(data.itemSelected.email);
      this.f.provinceId.setValue(data.itemSelected.provinceId);
      this.f.districtId.setValue(data.itemSelected.districtId);
      this.f.introducerId.setValue(data.itemSelected.receiverId);
      this.f.caregiverId.setValue(data.itemSelected.userTakeCareId);
      this.f.wardId.setValue(data.itemSelected.wardId);
      this.f.villageAddress.setValue(data.itemSelected.villageAddress);
    } else {
      this.f.mobileNumber.setValue(null);
      this.f.email.setValue(null);
      this.f.provinceId.setValue(null);
      this.f.districtId.setValue(null);
      this.f.introducerId.setValue(null);
      this.f.caregiverId.setValue(null);
      this.f.wardId.setValue(null);
      this.f.villageAddress.setValue(null);
    }
  }

  doOpenForm(type?: Mode, index?: number) {
    // const totalPDH = this.payments.filter(el => el.paymentType === 'PHI_DON_HANG').reduce((total, item) => total + item.amount, 0);
    // const totalHT = this.payments.filter(el => el.paymentType === 'HOAN_TRA').reduce((total, item) => total + item.amount, 0);
    // const totalGH = this.payments.filter(el => el.paymentType === 'PHI_GIEO_HAT').reduce((total, item) => total + item.amount, 0);
    //
    // const finalAmount = this.finalAmount - totalPDH;
    // const collectedAmount =  ;
    // const remainingAmount =  ;
    const data = type === Mode.EDIT || type === Mode.VIEW ? this.payments[index] : null;
    const modalRef = this.modal.create({
      nzWidth: this.getNzWidth() - 100,
      nzTitle: this.getModeTitle(type),
      nzContent: PaymentsFormComponent,
      nzComponentParams: {
        mode: type,
        data
      }
    });
    modalRef.afterClose.subscribe((result) => {
      if (result?.data) {
        if (type === Mode.EDIT) {
          this.payments[index] = result.data;
        } else {
          this.payments.push(result.data);
        }
      }
    });
  }

  onDeletePayment(idx: number) {
    this.popupService.showModalConfirmDelete(() => {
      if (this.payments[idx].paymentId) {
        this.paymentIds.push(this.payments[idx].paymentId);
      }
      this.payments.splice(idx, 1);
    });
  }
}



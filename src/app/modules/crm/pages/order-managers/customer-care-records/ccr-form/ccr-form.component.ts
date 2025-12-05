import {Component, Injector, OnInit} from '@angular/core';
import {FormArray, Validators} from "@angular/forms";
import {CustomerCareRecordsModel} from "../../../../data-access/models/order-managers/customer-care-records.model";
import {
  CustomerCareRecordsService
} from "../../../../data-access/services/order-managers/customer-care-records.service";
import {BaseFormComponent} from "@core/components/base-form.component";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {DataService} from "@shared/services/data.service";
import {EmployeesInfo} from "@app/modules/hrm/data-access/models/employee-info";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {CustomersService} from "@app/modules/crm/data-access/services/order-managers/customers.service";
import {CustomersModel} from "@app/modules/crm/data-access/models/hrm-managers/customers.model";
import { SelectModal } from '@shared/component/hbt-select/select.component';
import {EmployeesModel} from "@app/modules/crm/data-access/models/hrm-managers/employees.model";
import {EmployeesService} from "@app/modules/crm/data-access/services/hrm-managers/employees.service";
import {CustomValidators} from "@core/utils/custom-validations";

@Component({
  selector: 'ccr-form',
  templateUrl: './ccr-form.component.html',
  styleUrls: ['./ccr-form.component.scss']
})
export class CcrFormComponent extends BaseFormComponent<CustomerCareRecordsModel> implements OnInit {

  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = '/customer-care-records';
  customersInfo: CustomersModel | NzSafeAny;
  employeesInfo: EmployeesModel | NzSafeAny;
  selectedCustomerFullName: string | null = null;

  constructor(
    private readonly service: CustomerCareRecordsService,
    private readonly customerService: CustomersService,
    private readonly employeeService: EmployeesService,
    injector: Injector,
    private dataService: DataService,
  ) {
    super(injector);
    this.key = 'customerCareRecordId';

    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: CustomerCareRecordsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: CustomerCareRecordsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);

    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'crm_customer_care_records',
    });
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
        customerCareRecordId: [null],
        customerId: [null, [Validators.required]],
        fullName: [null],
        type: [null, [Validators.required]],
        mobileNumber: [null, [Validators.required, CustomValidators.phoneMobileVN]],
        dateOfBirth: [null],
        requestDate: [null],
        requestedEmpId: [null, [Validators.required]],
        caringEmpId: [null, [Validators.required]],
        contactDate: [null,],
        caringStatusId: [null, [Validators.required, Validators.maxLength(20)]],
        statusId: [null, [Validators.required, Validators.maxLength(20)]],
        note: [null, [Validators.maxLength(500)]],
        fileList: [null],
        listAttributes: this.fb.array([]),
      },
      {validators: []});
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  ngOnInit() {
    super.ngOnInit();
    this.getPersonalInfo();
    this.getCustomerInfo();
  }

  getPersonalInfo() {
    this.employeeService.getListEmployee(null).subscribe((res: any) => {
      this.employeesInfo = res.data;
    });
  }

  getCustomerInfo() {
    this.customerService.getListCustomer(null).subscribe((res: any) => {
      this.customersInfo = res.data;
    });
  }


  onCustomerSelect(event: SelectModal) {
    if (this.customersInfo) {
      const selectedCustomer = this.customersInfo.find(customer => customer.customerId === event?.itemSelected?.customerId);
      if (selectedCustomer) {
        const { fullName, mobileNumber, dateOfBirth } = selectedCustomer;
        this.selectedCustomerFullName = fullName;
        this.form.patchValue({ fullName, mobileNumber, dateOfBirth });
      }
    }
  }


}




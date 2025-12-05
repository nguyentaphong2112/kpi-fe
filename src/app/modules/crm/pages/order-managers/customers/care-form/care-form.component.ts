import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Validators} from "@angular/forms";
import {BaseFormComponent} from "@core/components/base-form.component";
import {MICRO_SERVICE} from "@core/constant/system.constants";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {CustomerCareRecordsModel} from "@app/modules/crm/data-access/models/order-managers/customer-care-records.model";
import {
  CustomerCareRecordsService
} from "@app/modules/crm/data-access/services/order-managers/customer-care-records.service";
import {EmployeesInfo} from "@app/modules/hrm/data-access/models/employee-info";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {CustomersService} from "@app/modules/crm/data-access/services/order-managers/customers.service";
import {EmployeesService} from "@app/modules/crm/data-access/services/hrm-managers/employees.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'payments-form',
  templateUrl: './care-form.component.html',
  styleUrls: ['./care-form.component.scss']
})
export class CareFormComponent extends BaseFormComponent<CustomerCareRecordsModel> implements OnInit {
  serviceName = MICRO_SERVICE.CRM
  employeesInfo: EmployeesInfo | NzSafeAny;
  data: any;
  @ViewChild('footerCareTmpl', { static: true }) footerCareTpl!: TemplateRef<any>;

  constructor(
    private readonly service: CustomerCareRecordsService,
    private readonly serviceCustomer: CustomersService,
    private readonly serviceEmployee: EmployeesService,
    private toastrService : ToastrService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'paymentId'
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: CustomerCareRecordsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: CustomerCareRecordsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
  }

  override initForm() {
    this.form = this.fb.group({
      customerCareRecordId: [null],
      caringEmpId: [null, [Validators.required]],
      note: [null, [Validators.maxLength(500)]],
    },
    {validators:
        []
    });
  }


  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const printCardData: CustomerCareRecordsModel = {
        ...this.data,
        caringEmpId: this.f.caringEmpId.value,
        note: this.f.note.value
      }
      this.serviceCustomer.customerCare(printCardData).subscribe(()=>{
        this.toastrService?.success(this.translate?.instant('crm.notification.sendTelesalesSuccess'));
        this.modalRef.close({refresh: true});
      });
    }

  }

  ngOnInit() {
    super.ngOnInit();
    this.getPersonalInfo();
  }

  getPersonalInfo() {
    this.serviceEmployee.getListEmployee(null).subscribe((res: any) => {
      this.employeesInfo = res.data;
    });
  }

}



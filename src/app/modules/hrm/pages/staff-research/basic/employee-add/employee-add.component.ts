import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { EmployeesModel } from '@app/modules/hrm/data-access/models/research/employees.model';
import { DataService } from '@shared/services/data.service';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Scopes } from '@core/utils/common-constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { distinctUntilChanged } from 'rxjs';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { Validators } from '@angular/forms';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { EmployeesService } from '@app/modules/hrm/data-access/services/staff-research/employees.service';
import { SelectModal } from '@shared/component/hbt-select/select.component';
import { PersonalInfoService } from '@app/modules/hrm/data-access/services/staff-research/personal-info.service';
import { Utils } from '@core/utils/utils';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent extends BaseFormComponent<EmployeesModel> implements OnInit {
  functionCode = FunctionCode.HR_PERSONAL_INFO;
  scope = Scopes.CREATE;
  listPosition: CategoryModel[] = [];

  constructor(
    private readonly service: EmployeesService,
    private readonly perService: PersonalInfoService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.findOneById = (id) => this.perService.findOneById(id);
    this.createApi = (body: EmployeesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: EmployeesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.initForm();
    this.key = 'employeeId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.orgChangeValue();
  }

  initForm() {
    this.form = this.fb.group({
      employeeId: null,
      employeeCode: null,
      email: [null, Validators.email],
      fullName: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      genderId: [null, [Validators.required]],
      organizationId: [null, [Validators.required]],
      positionId: [null, [Validators.required]],
      jobId: [null]
    });
  }

  orgChangeValue() {
    this.subscriptions.push(
      this.f.organizationId?.valueChanges.pipe(distinctUntilChanged()).subscribe(orgId => {
        this.listPosition = [];
        if (orgId) {
          const urlEndPoint = `${UrlConstant.POSITIONS.GET_BY_ORG}/${orgId}`;
          this.subscriptions.push(
            this.dataService.getData(urlEndPoint, this.microService.HRM).subscribe(res => {
              if (res.code === HTTP_STATUS_CODE.SUCCESS) {
                this.listPosition = res.data;
                if (!this.listPosition.some((item: any) => item.positionId === this.f.positionId.value)) {
                  this.f.positionId.reset(null);
                }
              }
            })
          );
        }
      })
    );
  }

  changePosition(event: SelectModal) {
    this.f.jobId.setValue(event?.itemSelected?.jobId ?? null);
  }

  beforeSave() {
    this.body.dateOfBirth = Utils.convertDateToSendServer(this.body.dateOfBirth);
  }
}

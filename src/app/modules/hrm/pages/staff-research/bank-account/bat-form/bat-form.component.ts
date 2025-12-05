import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { BankAccountModel } from '@app/modules/hrm/data-access/models/research/bank-accounts.model';
import { BankAccountService } from '@app/modules/hrm/data-access/services/staff-research/bank-account.service';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { Scopes } from '@app/core/utils/common-constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';

@Component({
  selector: 'app-bat-form',
  templateUrl: './bat-form.component.html',
  styleUrls: ['./bat-form.component.scss']
})
export class BatFormComponent extends BaseFormComponent<BankAccountModel> implements OnInit {
  constant = Constant;
  employeeId: number;
  hiddenEmp = false;
  functionCode = FunctionCode.HR_BANK_ACCOUNTS;
  scope = Scopes.CREATE;
  listBanks: CategoryModel[] = [];
  constructor(
    private readonly service: BankAccountService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.getListBank();
    this.initForm();
    this.key = 'bankAccountId';
    this.findOneById = (id) => this.service.findOneById(id, this.config ?? `/${this.data.employeeId}`);
    this.createApi = (body: BankAccountModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.updateApi = (body: BankAccountModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, this.config ?? `/${this.f.employeeId.value}`);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({tableName: 'hr_bank_accounts'});
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
      accountNo: [null, [Validators.required]],
      bankId: [null, [Validators.required]],
      bankBranch: [null],
      isMain: [false],
      bankAccountId: [null],
      listAttributes: this.fb.array([])
    });

    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  getListBank() {
    this.subscriptions.push(
      this.dataService.getData(this.getUrlCategory(this.categoryCode.NGAN_HANG), MICRO_SERVICE.ADMIN, true).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.listBanks = res.data.map((item: any) => {
            item.name += ` (${item.code})`;
            return item;
          })
        }
      })
    )
  }

  beforePatchValue() {
    this.data.isMain = this.data.isMain === 'Y';
  }

  beforeSave() {
    this.body.isMain = this.f.isMain.value ? 'Y' : null;
  }
}

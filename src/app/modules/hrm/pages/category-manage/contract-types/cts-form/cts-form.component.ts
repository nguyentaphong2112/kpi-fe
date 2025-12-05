import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { FormArray, Validators } from '@angular/forms';
import { ContractTypeService } from '@app/modules/hrm/data-access/services/category-manage/contract-type.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-cts-form',
  templateUrl: './cts-form.component.html',
  styleUrls: ['./cts-form.component.scss']
})
export class CtsFormComponent extends BaseFormComponent<any> implements OnInit {
  serviceName = MICRO_SERVICE.HRM;
  urlLoadEmpTypeList = UrlConstant.EMP_TYPES.GET_LIST;

  constructor(injector: Injector,
              private contractTypeService: ContractTypeService,
              private dataService: DataService) {
    super(injector);
    this.findOneById = (id) => this.contractTypeService.findOneById(id);
    this.createApi = (body: any) => this.contractTypeService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.contractTypeService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'hr_contract_types'
    });
    this.isPage = false;
    this.key = 'contractTypeId';
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(255)]],
      code: [null, [Validators.required, Validators.maxLength(255)]],
      classifyCode: [null, [Validators.required]],
      orderNumber: [null, [Validators.required]],
      empTypeId: [null, [Validators.required]],
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

}

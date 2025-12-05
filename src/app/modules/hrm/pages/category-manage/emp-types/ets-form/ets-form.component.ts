import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { FormArray, Validators } from '@angular/forms';
import { EmpTypeService } from '@app/modules/hrm/data-access/services/category-manage/emp-type.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-ets-form',
  templateUrl: './ets-form.component.html',
  styleUrls: ['./ets-form.component.scss']
})
export class EtsFormComponent extends BaseFormComponent<any> implements OnInit {

  constructor(injector: Injector,
              private empTypeService: EmpTypeService,
              private dataService: DataService) {
    super(injector);
    this.findOneById = (id) => this.empTypeService.findOneById(id);
    this.createApi = (body: any) => this.empTypeService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.empTypeService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'hr_emp_types'
    });
    this.isPage = false;
    this.key = 'empTypeId';
    this.getConfigAttributes();
  }


  override initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(255)]],
      code: [null, [Validators.required, Validators.maxLength(255)]],
      orderNumber: [null, [Validators.required]],
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

}

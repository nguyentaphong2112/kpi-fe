import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { WorkdayTypesModel } from '../../../../data-access/models/category-manager/workday-types.model';
import { WorkdayTypesService } from '../../../../data-access/services/category-manager/workday-types.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'wts-form',
  templateUrl: './wts-form.component.html',
  styleUrls: ['./wts-form.component.scss']
})
export class WtsFormComponent extends BaseFormComponent<WorkdayTypesModel> implements OnInit {

  serviceName = MICRO_SERVICE.ABS;
  urlLoadData = '/workday-types';

  constructor(
    private readonly service: WorkdayTypesService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: WorkdayTypesModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: WorkdayTypesModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'abs_workday_types',
      functionCode: null
    });
    this.key = 'workdayTypeId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
      workdayTypeId: [null],
      code: [null, [Validators.required, Validators.maxLength(255)]],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }
}



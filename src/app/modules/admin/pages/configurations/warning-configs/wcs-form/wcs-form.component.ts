import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { WarningConfigsModel } from '../../../../data-access/models/configurations/warning-configs.model';
import { WarningConfigsService } from '../../../../data-access/services/configurations/warning-configs.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { CategoryModel } from '@core/models/category-common.interface';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'wcs-form',
  templateUrl: './wcs-form.component.html',
  styleUrls: ['./wcs-form.component.scss']
})
export class WcsFormComponent extends BaseFormComponent<WarningConfigsModel> implements OnInit {

  serviceName = MICRO_SERVICE.ADMIN;
  urlLoadData = '/warning-configs';
  chooseYesNo: CategoryModel[] = [];

  constructor(
    private readonly service: WarningConfigsService,
    private dataService: DataService,
    injector: Injector
  ) {
    super(injector);
    this.key = 'warningConfigId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: WarningConfigsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: WarningConfigsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'sys_warning_configs'
    });
    this.getConfigAttributes();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getChooseYesNo();
  }

  override initForm() {
    this.form = this.fb.group({
        warningConfigId: [null],
        title: [null, [Validators.required, Validators.maxLength(255)]],
        resource: [null, [Validators.required, Validators.maxLength(255)]],
        backgroundColor: [null, [Validators.required, Validators.maxLength(255)]],
        icon: [null, [Validators.required, Validators.maxLength(255)]],
        apiUri: [null, [Validators.required, Validators.maxLength(255)]],
        urlViewDetail: [null, [Validators.required, Validators.maxLength(255)]],
        sqlQuery: [null, [Validators.required, Validators.maxLength(4000)]],
        isMustPositive: [null, [Validators.required]],
        orderNumber: [null, [Validators.required]],
        listAttributes: this.fb.array([])
      },
      {
        validators:
          []
      });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  getChooseYesNo() {
    this.subscriptions.push(
      this.dataService.getData(this.getUrlCategory(this.categoryCode.CHOOSE_YES_NO), this.microService.ADMIN, true).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.chooseYesNo = res.data;
        }
      })
    );
  }

}



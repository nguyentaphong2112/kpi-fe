import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { AppFunction } from '@core/models/app-function.interface';
import { Scopes } from '@core/utils/common-constants';
import { FormArray, Validators } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CommonUtils } from '@shared/services/common-utils.service';
import { DataService } from '@shared/services/data.service';
import { JobsService } from '@app/modules/hrm/data-access/services/model-plan/jobs.service';

@Component({
  selector: 'app-jobs-form',
  templateUrl: './jobs-form.component.html',
  styleUrls: ['./jobs-form.component.scss']
})
export class JobsFormComponent extends BaseFormComponent<any> implements OnInit, OnDestroy {
  functionCode = 'HR_MODEL_PLAN';
  objFunction!: AppFunction;
  scope = Scopes.EDIT;
  listAttributeConfig = [];

  constructor(injector: Injector,
              private service: JobsService,
              private dataService: DataService) {
    super(injector);
    this.findOneById = (id) => this.service.findOneById(id);
    this.updateApi = (body: NzSafeAny) => this.service.update(CommonUtils.convertDataSendToServer(body), null);
    this.createApi = (body: NzSafeAny) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), null);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({tableName: 'hr_jobs', functionCode: null});
    this.key = 'jobId';
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getConfigAttributes();
  }

  initForm() {
    this.form = this.fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      note: [null],
      orderNumber: [null],
      jobType: ['CONG_VIEC', [Validators.required]],
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }

}

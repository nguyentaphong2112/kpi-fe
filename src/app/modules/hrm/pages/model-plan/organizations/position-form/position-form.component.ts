import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { AppFunction } from '@core/models/app-function.interface';
import { Scopes } from '@core/utils/common-constants';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Validators } from '@angular/forms';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { PositionsService } from '@app/modules/hrm/data-access/services/model-plan/positions.service';
import { Mode } from '@shared/constant/common';
import { DataService } from '@shared/services/data.service';
import { CatalogModel } from '@shared/model/catalog-model';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss']
})
export class PositionFormComponent extends BaseFormComponent<any> implements OnInit, OnDestroy {
  @Input() organizationId!: number;
  listJobType: CatalogModel[] = [];
  listJob: any[] = [];

  functionCode = 'HR_MODEL_PLAN';
  objFunction!: AppFunction;
  scope = Scopes.EDIT;

  constructor(injector: Injector,
              private service: PositionsService,
              private dataService: DataService) {
    super(injector);
    this.initForm();
    this.key = 'positionId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.updateApi = (body: NzSafeAny) => this.service.update(CommonUtils.convertDataSendToServer(body), null);
    this.createApi = (body: NzSafeAny) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), null);
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
  }

  ngOnInit() {
    super.ngOnInit();
    this.listJobType = this.data.listJobType;
    this.changeJobType();
  }

  initForm() {
    this.form = this.fb.group({
      quotaNumber: [null, [Validators.min(1)]],
      jobIds: [null, [Validators.required]],
      organizationId: [null],
      jobType: [null, [Validators.required]]
    });
  }

  changeJobType() {
    this.subscriptions.push(
      this.f.jobType?.valueChanges.pipe(distinctUntilChanged()).subscribe(jobType => {
        this.listJob = [];
        if (jobType) {
          this.subscriptions.push(
            this.dataService.getDataByParam(UrlConstant.JOBS.GET_ALL, {jobType}, MICRO_SERVICE.HRM).subscribe(res => {
              if (res.code === HTTP_STATUS_CODE.SUCCESS) {
                this.listJob = res.data;
                if (!this.listJob?.some(item => item.jobId === this.f.jobId?.value)) {
                  this.f.jobId?.reset(null);
                }
              }
            })
          );
        }
      })
    );
  }

  beforeSave() {
    if (this.mode === Mode.ADD) {
      this.body.organizationId = this.data.organizationId;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
  }

}

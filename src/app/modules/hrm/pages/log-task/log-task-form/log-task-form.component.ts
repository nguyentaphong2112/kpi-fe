import { AfterViewInit, Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { AppFunction } from '@core/models/app-function.interface';
import { Scopes } from '@core/utils/common-constants';
import { LogTaskService } from '@shared/services/log-task.service';
import { DataService } from '@shared/services/data.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Validators } from '@angular/forms';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';

@Component({
  selector: 'app-log-task-form',
  templateUrl: './log-task-form.component.html',
  styleUrls: ['./log-task-form.component.scss']
})
export class LogTaskFormComponent extends BaseFormComponent<any> implements OnInit, OnDestroy, AfterViewInit {
  @Input() data: any;
  functionCode = 'LOG_TASK';
  objFunction!: AppFunction;
  scope = Scopes.EDIT;

  constructor(
    injector: Injector,
    private service: LogTaskService,
    private dataService: DataService
  ) {
    super(injector);
    this.findOneById = (id) => this.service.findOneById(id);
    this.updateApi = (body: NzSafeAny) => this.service.update(CommonUtils.convertDataSendToServer(body), null);
    this.createApi = (body: NzSafeAny) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), null);
    this.getConfigAttributeApi = () =>
      this.dataService.getAttributeConfig({ tableName: 'log_tasks', functionCode: null });
    this.key = 'logTaskId';
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
  }

  override ngOnInit(): void {
    this.initForm();
    super.ngOnInit();
    this.getConfigAttributes();
  }

  initForm(): void {
    this.form = this.fb.group({
      logDate: [null, [Validators.required]],
      projectCode: [null, [Validators.required]],
      name: [null, [Validators.required]],
      totalHouse: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      description: [null]
    });
  }

  onConfirm(): void {
    this.isSubmitted = true;
    if (this.form.invalid) {
      // this.toast.warning(this.translate.instant('common.validate.requiredField'));
      return;
    }

    const payload = CommonUtils.convertDataSendToServer(this.form.value);
    const apiCall = this?.id
      ? this.service.updateData(payload, this?.id)
      : this.service.createOrImport(payload, null);

    apiCall.subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(
          this.translate.instant(this.id ? 'common.notification.updateSuccess' : 'common.notification.addSuccess')
        );
        this.modalRef?.close({ refresh: true });
      } else {
        this.toast.error(this.translate.instant('common.notification.error'));
      }
    });
  }
  ngAfterViewInit(): void {
    if (this.data) {
      this.patchFormData(this.data);
    }
  }

  private patchFormData(data: any): void {
    this.form.patchValue({
      name: data.name,
      projectCode: data.projectCode,
      logDate: data.logDate ? new Date(data.logDate) : null,
      description: data.description,
      totalHouse: data.totalHouse
    });
  }
  onCancel(): void {
    this.form.reset();
    this.modalRef?.close({ refresh: false });
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach((sub) => sub.unsubscribe());
  }
  onProjectLoaded(list: any[]): void {
    if (list && list.length > 0 && this.data?.projectCode) {
      const found = list.find(x => x.value === this.data.projectCode);
      if (found) {
        this.form.patchValue({ projectCode: found.value });
      }
    }
  }
}

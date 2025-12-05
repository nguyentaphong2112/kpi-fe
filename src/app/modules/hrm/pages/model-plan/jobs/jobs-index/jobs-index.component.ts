import { Component, HostListener, Injector, OnDestroy, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { JobsFormComponent } from '@app/modules/hrm/pages/model-plan/jobs/jobs-form/jobs-form.component';
import { JobsService } from '@app/modules/hrm/data-access/services/model-plan/jobs.service';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-jobs-index',
  templateUrl: './jobs-index.component.html',
  styleUrls: ['./jobs-index.component.scss']
})
export class JobsIndexComponent extends BaseListComponent<any> implements OnInit, OnDestroy {
  functionCode = FunctionCode.HR_JOBS;
  isShowAdvSearch = false;

  constructor(injector: Injector, private service: JobsService) {
    super(injector);
    this.initForm();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination, '');
    this.exportApi = (body) => this.service.export(body);
    this.formConfig = {
      title: 'hrm.modelPlan.label.jobLower',
      content: JobsFormComponent,
    };
    this.key = 'jobId';
  }



  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }

  initForm() {
    this.form = this.fb.group({
      keySearch: null,
      listJobType: null
    });
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          disabled: (evt: any) => {
            return !evt;
          },
          function: this.doOpenFormEdit,
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          disabled: (evt: any) => {
            return !evt;
          },
          function: this.deleteItem,
        })
      ]
    });
  }

  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: true
      },
      {
        title: 'common.label.code',
        thClassList: ['text-center'],
        field: 'code',
        fixed: true,
        fixedDir: 'left',
        width: 200
      },
      {
        title: 'common.label.name',
        thClassList: ['text-center'],
        field: 'name',
        fixed: true,
        fixedDir: 'left',
      },
      {
        title: 'hrm.modelPlan.label.jobType',
        thClassList: ['text-center'],
        field: 'jobTypeName',
      },
      {
        title: 'common.label.note',
        thClassList: ['text-center'],
        field: 'note'
      },
      {
        title: 'common.label.createdBy',
        thClassList: ['text-center'],
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'createdTime',
        width: 150,
        show: false
      },
      {
        title: 'common.label.modifiedBy',
        thClassList: ['text-center'],
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'modifiedTime',
        width: 150,
        show: false
      },
      {
        title: '',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right',
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
    this.modalRef?.destroy();
  }

}

import { AfterViewInit, Component, Injector, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AppFunction } from '@core/models/app-function.interface';
import { BaseFormComponent } from '@core/components/base-form.component';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Scopes } from '@core/utils/common-constants';
import { LogTaskService } from '@shared/services/log-task.service';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { debounceTime } from 'rxjs';
import { LogTaskFormComponent } from '@app/modules/hrm/pages/log-task/log-task-form/log-task-form.component';

@Component({
  selector: 'app-log-task-index',
  templateUrl: './log-task-index.component.html',
  styleUrls: ['./log-task-index.component.scss']
})
export class LogTaskIndexComponent extends BaseFormComponent<any> implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('projectSelect') projectSelect: any;
  @Input() data: any;

  functionCode = 'LOG_TASK';
  objFunction!: AppFunction;
  scope = Scopes.EDIT;
  listData: any[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private service: LogTaskService,
    private dataService: DataService
  ) {
    super(injector);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({ tableName: 'log_tasks', functionCode: null });
    this.key = 'logTaskId';
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
  }

  override ngOnInit(): void {
    this.initForm();
    super.ngOnInit();
    this.getConfigAttributes();
    this.form.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const { projectCode, fromDate, toDate } = this.form.value;
      if (projectCode && fromDate && toDate) {
        this.getListData();
      }
    });
  }

  initForm(): void {
    const today = new Date();
    this.form = this.fb.group({
      fromDate: [today],
      toDate: [today],
      projectCode: [null],
      name: [null],
      createdBy: [null],
    });
  }

  onSearch(): void {
    this.getListData();
  }

  getListData(): void {
    const { projectCode, fromDate, toDate, name, createdBy } = this.form.value;
    if (!projectCode || !fromDate || !toDate) return;

    const params = CommonUtils.convertDataSendToServer({
      projectCode,
      fromDate,
      toDate,
      name,
      createdBy
    });

    this.isLoading = true;

    this.service.getList(params).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.code === HTTP_STATUS_CODE.SUCCESS && res.data?.listData) {
          this.listData = res.data.listData
            .filter((item: any) =>
              !createdBy || item.createdBy?.toLowerCase().includes(createdBy.toLowerCase())
            )
            .map((item: any, index: number) => ({
              stt: index + 1,
              ...item
            }));
        } else {
          this.listData = [];
        }
      },
      error: () => {
        this.isLoading = false;
        this.listData = [];
        this.toast.error(this.translate.instant('common.notification.error'));
      }
    });
  }

  onEdit(item: any): void {
    const modalRef = this.modal.create({
      nzTitle: 'Chỉnh sửa công việc',
      nzContent: LogTaskFormComponent,
      nzWidth: 800,
      nzFooter: null,
      nzComponentParams: {
        data: { ...item}
        }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.refresh) {
        this.getListData();
      }
    });
  }


  onDelete(item: any): void {
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa',
      nzContent: 'Bạn có chắc chắn muốn xóa bản ghi này không?',
      nzOkText: 'Xóa',
      nzOkDanger: true,
      nzOnOk: () => {
        this.service.deleteById(item.logTaskId).subscribe({
          next: (res) => {
            if (res.code === HTTP_STATUS_CODE.SUCCESS) {
              this.toast.success(this.translate.instant('common.notification.deleteSuccess'));
              this.getListData();
            } else {
              this.toast.error(this.translate.instant('common.notification.error'));
            }
          },
          error: () => {
            this.toast.error(this.translate.instant('common.notification.error'));
          }
        });
      }
    });
  }
  ngAfterViewInit(): void {
    const checkLoaded = setInterval(() => {
      const data = this.projectSelect?.data;
      if (data && data.length > 0) {
        clearInterval(checkLoaded);

        const latestProject = data[0];

        this.form.patchValue({
          projectCode: latestProject.value
        });

        this.getListData();
      }
    }, 300);
  }

  onAddNew(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Thêm mới công việc',
      nzContent: LogTaskFormComponent,
      nzWidth: 800,
      nzFooter: null,
      nzComponentParams: {
      }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.refresh) {
        this.getListData();
      }
    });
  }
  ngOnDestroy(): void {
    this.subscriptions?.forEach((sub) => sub.unsubscribe());
  }
  onProjectLoaded(list: any[]) {
    if (list && list.length > 0 && !this.form.value.projectCode) {
      this.form.patchValue({ projectCode: list[0].value });
      this.getListData();
    }
  }
}

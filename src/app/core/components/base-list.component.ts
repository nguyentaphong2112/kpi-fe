import { Component, HostListener, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { BaseComponent } from './base.component';
import { BaseResponse } from '../models/base-response';
import { statusOptions } from '../models/IOption';
import { ObjectUtil } from '../utils/object.util';
import { Mode, TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { Pagination } from '@shared/model/pagination';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { HBTTableConfig } from '@shared/component/hbt-table/hbt-table.interfaces';
import { ActionSchema } from '@core/models/action.model';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BaseService } from '@core/services/base/base.service';
import { CommonUtils } from '@shared/services/common-utils.service';

@Component({
  template: `
    <ng-content></ng-content>`
})
export class BaseListComponent<T> extends BaseComponent implements OnInit {
  functionCode: string;
  isSubmitted = false;
  isSubmittedImport = false;
  formImport!: FormGroup;
  modalRef!: NzModalRef;
  @ViewChild('flagStatusTpl', { static: true }) flagStatusTpl!: TemplateRef<any>;
  @ViewChild('actionTmpl', { static: true }) actionTpl!: TemplateRef<any>;
  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;
  key = 'id';
  responseSearch: BaseResponse<any>;
  searchApi!: (body: T, pagination: { startRecord: number, pageSize: number }) => Observable<BaseResponse<any>>;
  exportApi!: (params: T) => Observable<any>;
  importApi!: (body: any) => Observable<BaseResponse<any>>;
  downLoadTemplateApi!: (url?: string) => Observable<any>;
  doDownloadFileByNameApi!: (url?: string, fileName?: string) => Observable<any>;
  deleteApi!: (id: number) => Observable<BaseResponse<any>>;
  lockApi!: (id: number, afterUrl?: string) => Observable<BaseResponse<any>>;
  unlockApi!: (id: number, afterUrl?: string) => Observable<BaseResponse<any>>;
  resetPasswordApi!: (id: number, afterUrl?: string) => Observable<BaseResponse<any>>;
  approveByListApi!: (listId: number[], afterUrl?: string) => Observable<BaseResponse<any>>;
  rejectByListApi!: (listId: number[], reason: string, afterUrl?: string) => Observable<BaseResponse<any>>;
  approveAllApi!: (data: any, afterUrl?: string) => Observable<BaseResponse<any>>;
  actionSchema: ActionSchema;
  addWidth = 0;
  formConfig!: { title: string; content: any, isCloseModal?: boolean, config?: any };
  statusOptions = statusOptions();
  statusDict = ObjectUtil.optionsToDict(this.statusOptions);
  statusList = ObjectUtil.optionsToList(this.statusOptions, this.translate);
  tableData: T[] = [];
  tableConfig: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };
  params: any = {};
  pagination = new Pagination();
  fileExportName: string;
  isCustomSearch: boolean;
  serviceName = '';
  isImportData = false;
  fileTemplateName = 'templateImport.xlsx';
  urlApiDownloadTemp = '';
  urlApiImport = '';
  isShowPopupConfirm = true;
  isDisabled = false;
  isReject = false;
  rejectId: number;
  listId: any[] = [];
  objFilter: any = {};
  nameLocalSearch = null;
  nameLocalForm = null;
  isShowAdvSearch = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && (this.modalRef?.state === 2 || !this.modalRef)) {
      this.search();
    }
  }

  getBaseUrl(serviceName: string) {
    return BaseService.getBaseUrl(serviceName);
  }

  doCloseReject(refresh: boolean) {
    this.isReject = false;
    if (refresh) {
      this.resetListId();
      this.search(this.pagination.pageNumber);
    }
  }

  resetListId() {
    this.rejectId = null;
    this.listId = [];
  }

  doRejectById = (data: T) => {
    this.isReject = true;
    this.rejectId = data[this.key];
  };
  doApproveById = (data: T) => {
    this.subscriptions.push(
      this.approveByListApi([data[this.key]]).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(this.translate.instant('common.notification.isApprove'));
          this.search(this.pagination.pageNumber);
        } else {
          this.toast.error(res.message);
        }
      }, error => {
        this.toast.error(error.message);
      })
    );
  };

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.nameLocalSearch != null && JSON.parse(localStorage.getItem(this.nameLocalSearch)) && JSON.parse(localStorage.getItem(this.nameLocalForm))) {
      const searchValue = localStorage.getItem(this.nameLocalSearch);
      this.form.patchValue(JSON.parse(searchValue));
      localStorage.removeItem(this.nameLocalForm);
    } else {
      localStorage.removeItem(this.nameLocalSearch);
    }
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.setHeaders();
    if (!this.isCustomSearch) {
      this.search();
    }
    this.isNotPageName = document.getElementsByClassName('inner-content--no-page-name').length > 0;
  }

  search(page?: number) {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.nameLocalSearch != null) {
      CommonUtils.setFormSearchToLocalStorageByName(this.nameLocalSearch, this.form.value);
    }
    const params = this.form.value;
    this.params = {
      ...params,
      ...this.objFilter
    };
    this.pagination.pageNumber = page ?? 1;
    this.beforeSearch();
    this.searchApi(this.params, this.pagination.getCurrentPage())
      .subscribe(
        (res: BaseResponse<any>) => {
          this.responseSearch = res;
          this.beforeRenderTable();
          this.handleRes(this.responseSearch.data ? this.responseSearch.data : this.responseSearch);
        }
      );
  }

  beforeSearch() {
    // trước khi call api search
  }

  beforeRenderTable() {
    // trước khi umpdate data table
  }

  export() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const params = this.form.value;
    this.params = {
      ...params
    };
    this.beforeExport();
    this.exportApi(this.params).toPromise();
  }

  beforeExport() {
    // beforeExport
  }

  doImportData() {
    this.isImportData = true;
  }

  doCloseImport(isSearch: boolean) {
    this.isImportData = false;
    this.isSubmittedImport = false;
    this.afterCloseImport();
    if (isSearch) {
      this.search();
    }
  }

  afterCloseImport() {

  }

  changeSubmittedImport($event) {
    if ($event) {
      this.isSubmittedImport = true;
    }
  }

  lockItem = (data: T) => {
    this.lockApi(data[this.key]).subscribe((res: BaseResponse<any>) => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(
          this.translate.instant('common.notification.lockSuccess')
        );
        this.search();
      }
    });
  }

  unlockItem = (data: T) => {
    this.unlockApi(data[this.key]).subscribe((res: BaseResponse<any>) => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(
          this.translate.instant('common.notification.unlockSuccess')
        );
        this.search();
      }
    });
  }

  deleteItem = (data: T) => {
    if (this.isShowPopupConfirm) {
      this.popupService.showModalConfirmDelete(() => {
        this.processDeleteData(data[this.key]);
      });
    } else {
      this.processDeleteData(data[this.key]);
    }
  }

  processDeleteData(id) {
    this.deleteApi(id)
      .subscribe((res: BaseResponse<any>) => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(
            this.translate.instant('common.notification.deleteSuccess')
          );
          this.search();
        }
      }
    );
  }

  doOpenFormDetail = (data: T) => {
    this.doOpenForm(Mode.VIEW, data);
  }

  doOpenFormEdit = (data: T) => {
    this.doOpenForm(Mode.EDIT, data);
  }

  doOpenForm(mode: Mode, data?: T) {
    if (this.formConfig) {
      this.modalRef = this.modal.create({
        nzWidth: this.getNzWidth() + (this.addWidth ? this.addWidth : 0),
        nzTitle: this.getModeTitle(mode) + this.translate.instant(this.formConfig.title),
        nzContent: this.formConfig.content,
        nzMaskClosable: this.formConfig.isCloseModal,
        nzComponentParams: {
          mode,
          data,
          config: this.formConfig.config
        },
        nzFooter: mode !== Mode.VIEW ? this.footerTpl : null
      });
      this.modalRef.afterClose.subscribe((result) => {
          if (result?.refresh) {
            this.search(this.pagination.pageNumber);
            this.afterRefresh();
          }
        }
      );
    } else {
      const param: any = { mode };
      if (mode !== Mode.ADD) {
        param.data = JSON.stringify({ [this.key]: data[this.key] });
      }
      this.router.navigate([this.router.url, 'form'], { queryParams: param });
    }
  }


  afterRefresh() {

  }

  protected getModeTitle(mode: Mode): string {
    let title = '';
    switch (mode) {
      case Mode.ADD:
        title = this.translate.instant('common.title.add');
        break;
      case Mode.EDIT:
        title = this.translate.instant('common.title.edit');
        break;
      case Mode.VIEW:
        title = this.translate.instant('common.title.view');
        break;
    }
    return title;
  }

  override handleDestroy() {
    super.handleDestroy();
    this.modalRef?.destroy();
  }

  trackFnTable(index: number, item: any) {
    return item[this.key];
  }

  handleRes(res: any) {
    this.tableData = res.listData;
    this.tableConfig.total = res.total;
    this.tableConfig.pageIndex = res.pageIndex;
  }

  setHeaders() {
    // Set headers
  }

  getObject(data: T, args?: Record<string, any>): Record<string, any> {
    return { ...data, ...args };
  }

  doDownLoadFile(file: any) {

  }
}

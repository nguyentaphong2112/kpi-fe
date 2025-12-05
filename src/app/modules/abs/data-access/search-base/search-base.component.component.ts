import { ViewChild, Injectable, TemplateRef, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalOptions, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {HBTTableConfig} from "@shared/component/hbt-table/hbt-table.interfaces";
import {Pagination} from "@shared/model/pagination";
import {Constant} from "@app/modules/abs/data-access/constant/constant.class";
import {CommonUtils} from "@shared/services/common-utils.service";
import {Mode} from "@shared/constant/common";

@Injectable()
export class SearchBaseComponent {
  public FILE_TYPE_PERSONAL_UPLOAD = 'xls,xlsx,doc,docx,pdf,png,jpg,rar,zip'; // bien xu ly validate file upload trong cac qa trinh cua nhan vien
  tableConfig!: HBTTableConfig;
  resultList: any = {};
  formSearch?: FormGroup;
  @ViewChild('mbTable') mbTable: any;
  private mainService: any;
  searchResult: any[] = [];
  subs: Subscription[] = [];
  pagination = new Pagination();
  modal?: NzModalRef;
  modalComponent: any;
  isLoadingPage = false;
  EMP_STATUS_DATASOURCE = Constant.EMP_STATUS_DATASOURCE;
  protected fb?: FormBuilder;

  // innit service
  public actr?: ActivatedRoute;
  public modalService?: NzModalService;
  public translate?: TranslateService;
  public toastrService?: ToastrService;

  constructor(
    private injector: Injector
  ) {
    this.innitService();
  }

  innitService() {
    this.modalService = this.injector.get(NzModalService);
    this.fb = this.injector.get(FormBuilder);
    this.actr = this.injector.get(ActivatedRoute);
    this.toastrService = this.injector.get(ToastrService);
    this.translate = this.injector.get(TranslateService);
  }

  ngOnDestroy() {
  }

  buildFormSearch(formSearchConfig: any, _validators?: ValidatorFn[] ) {
    this.formSearch = this.fb?.group( formSearchConfig );
    if (_validators) {
      this.formSearch?.setValidators(_validators);
    }
  }

  public setMainService(serviceSearch: any) {
    this.mainService = serviceSearch;
  }

  public setDataTable(param = {
    resultList: undefined,
    formSearch: undefined
  }) {
    this.resultList = param.resultList;
    this.formSearch = param.formSearch;
  }

  public doSearch(pageNumber?: number): void {
    this.pagination.pageNumber = pageNumber ?? 1;
    this.tableConfig.pageIndex = pageNumber ? this.tableConfig.pageIndex: 1;
    this.tableConfig.loading = true;
    const params = this.formSearch ? {...this.formSearch.value} : {};
    this.mainService.search({ ...params, ...this.pagination.getCurrentPage() }).subscribe((res: any) => {
      if (CommonUtils.isSuccessRequest(res)) {
        this.searchResult = res.data.listData;
        this.tableConfig.total = res.data.count;
      }
      this.resultList = res;
      this.tableConfig.loading = false;
      this.isLoadingPage = false;
    },
      () => {
	      this.isLoadingPage = false;
      }
    );
  }

  /**
   * Xu ly xoa
   */
  public doDelete(id: any): void {
    this.mainService.deleteById(id).subscribe((res: any) => {
      if (CommonUtils.isSuccessRequest(res)) {
        this.doSearch();
        this.toastrService?.success(this.translate?.instant('common.notification.deleteSuccess'));
      }
    })
  }

  objectCreateModal(id?: number): ModalOptions {
    return {
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: this.translate?.instant(id ? this.modalComponent.updateTitleKey : this.modalComponent.addTitleKey),
      nzContent: this.modalComponent,
      nzComponentParams: {
        mode: id ? Mode.EDIT : Mode.ADD,
        id: id
      }
    }
  };

  doPrepareInserOrUpdate(id?: number) {

    this.modal = this.modalService?.create(this.objectCreateModal(id));

    this.modal?.afterClose.subscribe(isSearch => {
      if (isSearch) {
        this.doSearch();
      }
    });
  }

}

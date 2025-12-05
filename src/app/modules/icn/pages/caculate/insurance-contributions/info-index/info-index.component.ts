import {AfterViewInit, Component, Injector, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HBTTableHeader} from "@shared/component/hbt-table/hbt-table.interfaces";
import {FormGroup, Validators} from "@angular/forms";
import {
  SearchFormComponent
} from "@app/modules/hrm/pages/staff-research/search-form-common/search-form/search-form.component";
import {CategoryModel} from "@core/models/category-common.interface";
import {BookmarkFormService} from "@app/modules/hrm/data-access/services/staff-research/bookmark-form.service";
import {CommonUtils} from "@shared/services/common-utils.service";
import {REQUEST_TYPE} from "@shared/constant/common";
import {ObjectUtil} from "@core/utils/object.util";
import {Constant} from "@app/modules/hrm/data-access/constant/constant.class";
import {BaseListComponent} from "@core/components/base-list.component";
import {SearchFormService} from "@app/modules/icn/data-access/services/search-form.service";
import {BaseResponse} from "@core/models/base-response";

@Component({
  selector: 'app-info-index',
  templateUrl: './info-index.component.html',
  styleUrls: ['./info-index.component.scss']
})
export class InfoIndexComponent extends BaseListComponent<any>implements OnInit, AfterViewInit, OnDestroy  {
  @Input() addWidth = 0;
  @Input() isShowBtnAdd = true;
  @Input() isShowBtnAddCustom = false;
  @Input() isShowBtnImport = false;
  @Input() functionCode: string;
  @Input() urlSearchApi: string;
  @Input() isShowAction = true;
  @Input() tableHeaders: HBTTableHeader[];
  @Input() isShowInput = false;
  employeeId: number;
  nzWidth: number;

  constructor(
    injector: Injector,
    private service: SearchFormService
  ) {
    super(injector);
    this.initFormSearch();
    this.isCustomSearch = true;
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination, this.urlSearchApi);
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, { fileName: fileName });
    this.nzWidth = window.innerWidth / 2 > 800 ? 800 : window.innerWidth / 2;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
  }

  initFormSearch(){
    this.form = this.fb.group({
      keySearch: [null],
    });
  };


  ngAfterViewInit() {
    this.doSearch(1);
  }

  doSearch(page: number) {
    this.search(page);
  }

  override setHeaders() {
    this.tableConfig.pageSize = 999;
    this.tableConfig.headers = this.tableHeaders;
    if (this.isShowAction) {
      this.tableConfig.headers.push({
        title: '',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      });
    }
  }


  override deleteItem = (data: any) => {
    this.employeeId = data?.employeeId;
    if (this.isShowPopupConfirm) {
      this.popupService.showModalConfirmDelete(() => {
        this.processDeleteData(data[this.key]);
      });
    } else {
      this.processDeleteData(data[this.key]);
    }
  };

  override handleRes(res: any) {
    this.tableData = res.listData;
    this.tableConfig.total = res.total;
    this.tableConfig.pageIndex = res.pageIndex;
  }

  override beforeRenderTable() {
    this.responseSearch = {
      ...this.responseSearch,
      data: {
        listData: this.responseSearch.data,
        total:999,
        pageIndex:1
      }
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}

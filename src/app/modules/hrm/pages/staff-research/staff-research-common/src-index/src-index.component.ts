import {
  AfterViewInit,
  Component,
  ContentChild,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { SearchFormService } from '@app/modules/hrm/data-access/services/search-form.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { SearchFormComponent } from '../../search-form-common/search-form/search-form.component';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { FormGroup } from '@angular/forms';
import { REQUEST_TYPE } from '@shared/constant/common';
import { ObjectUtil } from '@core/utils/object.util';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { CategoryModel } from '@core/models/category-common.interface';

@Component({
  selector: 'app-src-index',
  templateUrl: './src-index.component.html',
  styleUrls: ['./src-index.component.scss']
})
export class SrcIndexComponent extends BaseListComponent<any> implements OnInit, AfterViewInit, OnDestroy {
  @Input() addWidth = 0;
  @Input() isShowBtnAdd = true;
  @Input() isShowBtnAddCustom = false;
  @Input() isShowBtnImport = false;
  @Input() moduleName: string;
  @Input() functionCode: string;
  @Input() fileExportName: string;
  @Input() urlSearchApi: string;
  @Input() urlDeleteApi: string;
  @Input() key = 'id';
  @Input() urlExportApi: string;
  @Input() urlImportTemplateApi: string;
  @Input() urlImportApi: string;
  @Input() isShowAction = true;
  @Input() tableHeaders: HBTTableHeader[];
  @Input() formConfig: any;
  @Input() formConfigCustom: any;
  @Input() showBtnDelete = true;
  @Input() formImport: FormGroup;
  @Input() isShowInput = false;
  @Input() isForce = true;
  employeeId: number;
  @ViewChild('searchForm') searchForm!: SearchFormComponent;
  @ContentChild('formHrm') formHrm!: TemplateRef<any>;
  nzWidth: number;
  listForceUpdate: CategoryModel[] = [];

  constructor(
    injector: Injector,
    private service: SearchFormService
  ) {
    super(injector);
    this.isCustomSearch = true;
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true), this.getUrlExportApi());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination, this.urlSearchApi);
    this.deleteApi = (id: number | string) => this.service.deleteById(id?.toString(), this.getUrlDeleteApi());
    this.downLoadTemplateApi = () => this.service.downloadFile(this.getUrlImportTemplate(), this.formImport?.value);
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, this.getUrlImport());
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, { fileName: fileName });
    this.nzWidth = window.innerWidth / 2 > 800 ? 800 : window.innerWidth / 2;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    if (this.isShowBtnImport && this.isShowInput) {
      this.listForceUpdate = ObjectUtil.optionsToList(Constant.LIST_FORCE_UPDATE, this.translate);
    }
  }


  ngAfterViewInit() {
    this.doSearch(1);
  }

  getUrlDeleteApi(): string {
    return (this.urlDeleteApi ? this.urlDeleteApi : `${this.urlSearchApi}/{employeeId}`)?.replace('{employeeId}', this.employeeId?.toString() ?? '');
  }

  getUrlExportApi(): string {
    return (this.urlExportApi ? this.urlExportApi : `${this.urlSearchApi}/export`);
  }

  getUrlImportTemplate(): string {
    return (this.urlImportTemplateApi ? this.urlImportTemplateApi : `${this.urlSearchApi}/import-template`);
  }

  getUrlImport(): string {
    return (this.urlImportApi ? this.urlImportApi : `${this.urlSearchApi}/import`);
  }

  doSearch(page: number) {
    if (this.searchForm) {
      this.searchForm.isSubmitted = true;
      if (this.searchForm.form.valid) {
        this.form = this.searchForm.form;
        this.search(page);
      }
    }
  }

  override setHeaders() {
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

  onClickItem(data: any) {
    this.router.navigate(['/hrm/staff/personal-info'], {
      queryParams: { employeeId: data.employeeId, employeeCode: data.employeeCode }
    }).then();
  }

  doExportData() {
    if (this.searchForm) {
      this.form = this.searchForm.form;
      this.export();
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
    this.tableData = res.listData.map(item => {
      item.positionNameStr = [item.positionName, item.jobName].filter(Boolean).join(', ');
      return item;
    });
    this.tableConfig.total = res.total;
    this.tableConfig.pageIndex = res.pageIndex;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}


import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {IncomeItemsModel} from '../../../../data-access/models/income/income-items.model';
import {IncomeItemsService} from '../../../../data-access/services/income/income-items.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {Scopes} from "@core/utils/common-constants";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";
import {IisFormComponent} from "@app/modules/pit/pages/income/income-items/iis-form/iis-form.component";
import {Constant} from "@app/modules/pit/data-access/constant/constant.class";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {CategoriesService} from "@app/modules/kpi/data-access/other-services/categories.service";

@Component({
  selector: 'app-iis-index',
  templateUrl: './iis-index.component.html',
  styleUrls: ['./iis-index.component.scss']
})


export class IisIndexComponent extends BaseListComponent<IncomeItemsModel> implements OnInit {
  serviceName = MICRO_SERVICE.PIT;
  urlLoadData = '/income-items';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  isShowAdvSearch = false;
  visibleActionsCount = 0;
  actionSchemaHeader: ActionSchema;
  scope: string = Scopes.VIEW;
  urlConstant = UrlConstant;
  statusCodes = Constant.KHOAN_THU_NHAP_STATUS;
  statusCodeList: NzSafeAny[] = [];
  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;

  constructor(
    injector: Injector,
    private readonly service: IncomeItemsService,
    private readonly categoryService: CategoriesService
  ) {
    super(injector);
    this.initFormSearch();
    this.getDataSelect();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.serviceName = MICRO_SERVICE.PIT;
    this.key = 'incomeItemId';

    this.formConfig = {
      title: 'pit.breadcrumb.items',
      content: IisFormComponent
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      listType: [null],
      salaryPeriodDate: [null],
      name: [null],
      status: [null],
    });
  }

  override beforeSearch() {
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          function: this.deleteItem
        })
      ]
    });
  }

  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', Constant.CATEGORY.KHOAN_THU_NHAP))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.statusCodeList = res.data.map((item: NzSafeAny) => {
            if (this.statusCodes.CHUA_SU_DUNG == item.code) {
              item.color = '#F99600';
              item.bgColor = '#FFF2DA';
            } else {
              item.color = '#06A561';
              item.bgColor = '#DAF9EC';
            }
            return item;
          });
        }
      });
  }


override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 20
      },
        {
          title: 'pit.items.table.salaryPeriodDate',
          field: 'salaryPeriodDate',
          width: 70,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.items.table.code',
          field: 'code',
          width: 150,
        },
        {
          title: 'pit.items.table.name',
          field: 'name',
          width: 350,
        },
        {
          title: 'pit.items.table.typeName',
          field: 'typeName',
          width: 150,
        },
      {
          title: 'pit.items.table.status',
          fieldType: 'tdTemplate',
          fieldTypeValue: this.statusTmpl,
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 150,
        },
        {
          title: 'pit.items.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'pit.items.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.items.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'pit.items.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: '',
          field: 'action',
          tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
          width: 20,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.actionTpl,
          fixed: window.innerWidth > 1024,
          fixedDir: 'right',
          show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
        }
      ]
    };
  }


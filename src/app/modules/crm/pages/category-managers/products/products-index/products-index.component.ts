import {Component, HostListener, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ProductsModel} from '../../../../data-access/models/category-managers/products.model';
import {ProductsService} from '../../../../data-access/services/category-managers/products.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {Constant} from "@app/modules/crm/data-access/constants/constants";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {
  ProductsFormComponent
} from "@app/modules/crm/pages/category-managers/products/products-form/products-form.component";
import {CategoryModel} from "@core/models/category-common.interface";

@Component({
  selector: 'app-products-index',
  templateUrl: './products-index.component.html',
  styleUrls: ['./products-index.component.scss']
})


export class ProductsIndexComponent extends BaseListComponent<ProductsModel> implements OnInit {
  serviceNameAdmin = MICRO_SERVICE.ADMIN;
  urlLoadData = '/products';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  isShowAdvSearch = false;
  functionCode = Constant.FUNCTION_CODE.CRM_PRODUCTS;

  categoryType: CategoryModel[] = [];

  constructor(
    injector: Injector,
    private readonly service: ProductsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import-process');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, {fileName: fileName});
    this.serviceName = MICRO_SERVICE.CRM;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'productId';

    this.formConfig = {
      title: 'crm.breadcrumb.product',
      content: ProductsFormComponent
    }
    this.addWidth = window.innerWidth > 1200 ? (window.innerWidth - 1200) / 2 : window.innerWidth / 3;
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      categoryId: [null],
      statusId: [null],

    });
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      // el.list = this.list;
    });
  }

  override beforeExport() {
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        })
      ]
    });
  }


override setHeaders() {
    this.tableConfig.key = this.key;
    this.tableConfig.showSelect = false;
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
        {
          title: 'crm.products.table.code',
          field: 'code',
          width: 120,
        },
        {
          title: 'crm.products.table.name',
          field: 'name',
          width: 120,
        },
        {
          title: 'crm.products.table.unitId',
          field: 'unitName',
          width: 120,
        },
        {
          title: 'crm.products.table.unitPrice',
          field: 'unitPrice',
          width: 120,
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.products.table.categoryId',
          field: 'categoryName',
          width: 120,
        },
        {
          title: 'crm.products.table.statusId',
          field: 'statusName',
          width: 120,
        },
        {
          title: 'crm.products.table.isDeleted',
          field: 'isDeleted',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.products.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'crm.products.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.products.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'crm.products.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.products.table.lastUpdateTime',
          field: 'lastUpdateTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'common.label.attachFile',
          field: 'attachFileList',
          width: 250,
          show: false,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.attachFile
        },
        {
          title: ' ',
          field: 'action',
          tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
          width: 50,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.actionTpl,
          fixed: window.innerWidth > 1024,
          fixedDir: 'right',
          show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
        }
      ]
    };
  }


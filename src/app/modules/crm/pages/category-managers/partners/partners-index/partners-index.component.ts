import { Component, HostListener, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PartnersModel } from '../../../../data-access/models/category-managers/partners.model';
import { PartnersService } from '../../../../data-access/services/category-managers/partners.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { Constant } from '@app/modules/crm/data-access/constants/constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import {
  PartnersFormComponent
} from '@app/modules/crm/pages/category-managers/partners/partners-form/partners-form.component';
import { PrintFormComponent } from '@app/modules/crm/ui/print-form/print-form.component';
import { LogActionFormComponent } from '@app/modules/crm/ui/log-action-form/log-action-form.component';

@Component({
  selector: 'app-partners-index',
  templateUrl: './partners-index.component.html',
  styleUrls: ['./partners-index.component.scss']
})


export class PartnersIndexComponent extends BaseListComponent<PartnersModel> implements OnInit {
  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = '/partners';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  isShowAdvSearch = false;
  functionCode = Constant.FUNCTION_CODE.CRM_PARTNERS;
  actionSchemaHeader: ActionSchema;
  visibleActionsCount = 0;

  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: PartnersService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import-process');
    this.downLoadTemplateApi = () => this.service.downloadFile('/export-template');
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.service.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason);
    this.approveAllApi = (data: any, afterUrl?: string) => this.service.approveAll(CommonUtils.convertDataSendToServer(data));
    this.serviceName = MICRO_SERVICE.CRM;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'partnerId';

    this.formConfig = {
      title: 'crm.breadcrumb.partner',
      content: PartnersFormComponent
    };
    this.addWidth = window.innerWidth > 1200 ? (window.innerWidth - 1200) / 2 : window.innerWidth / 3;
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      partnerType: [null],
      dateOfBirth:[null],
      endDate: [null],
      objType: ['DOI_TAC']
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }

  initAction() {
    this.actionSchemaHeader = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.uploadFile',
          icon: 'upload',
          isShow: this.objFunction?.import,
          function: () => {
            this.doImportData();
          }
        }),
        new ChildActionSchema({
          label: 'crm.printCard',
          icon: 'printer',
          isShow: true,
          function: () => {
            this.doOpenPrint();
          }
        }),
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'export',
          isShow: true,
          function: () => {
            this.export();
          }
        })
      ]
    });
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.view',
          icon: 'eye',
          isShow: this.objFunction?.view,
          function: this.doOpenFormDetail
        }),
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
        }),
        new ChildActionSchema({
          label: 'crm.table.action.print',
          icon: 'printer',
          isShow: this.objFunction?.create,
          function: this.print
        }),
        new ChildActionSchema({
          label: 'crm.table.action.log',
          icon: 'history',
          isShow: this.objFunction?.create,
          function: this.logAction
        })
      ]
    });
    this.visibleActionsCount = this.actionSchemaHeader.arrAction.filter(it => it.isShow && it.isShowFn).length;
  }

  private print = (data) => {
    this.doOpenPrint(data.partnerId);
  };

  private logAction = (data) => {
    this.doOpenFormLogActions(data[this.key]);
  };

  doOpenPrint(objId?: number) {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() + (this.addWidth ? this.addWidth : 0),
      nzTitle: this.translate.instant('crm.pageName.cardSample'),
      nzContent: PrintFormComponent,
      nzComponentParams: {
        data: { objType: this.form.controls['objType'].value, objId }
      },
      nzFooter: null
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.search(this.pagination.pageNumber);
        }
      }
    );
  }

  doOpenFormLogActions(id: number): void {
    const data = this.tableData.find(item => item[this.key] === id);
    if (data) {
      data.listObjType = 'crm_partners';
      data.id = id;
      this.modalRef = this.modal.create({
        nzWidth: this.getNzWidth() + (window.innerWidth > 1110 ? (window.innerWidth - 1110) / 3 : window.innerWidth / 4),
        nzTitle: this.translate.instant('crm.pageName.logAction'),
        nzContent: LogActionFormComponent,
        nzComponentParams: {
          data
        },
        nzFooter: null
      });
      this.modalRef.afterClose.subscribe((result) => {
      });
    } else {
      this.toast.error(this.translate.instant('common.notification.recordNotFound'));
    }
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


  override setHeaders() {
    this.tableConfig.key = this.key;
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
        title: 'crm.partners.table.fullName',
        field: 'fullName',
        width: 120
      },
      {
        title: 'crm.partners.table.dateOfBirth',
        field: 'dateOfBirth',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.partners.table.mobileNumber',
        field: 'mobileNumber',
        width: 120
      },
      {
        title: 'crm.partners.table.zaloAccount',
        field: 'zaloAccount',
        width: 120
      },
      {
        title: 'crm.partners.table.email',
        field: 'email',
        width: 120
      },
      {
        title: 'crm.partners.table.partnerType',
        field: 'partnerTypeName',
        width: 120
      },
      {
        title: 'crm.partners.table.currentAddress',
        field: 'currentAddress',
        width: 120
      },
      {
        title: 'crm.partners.table.job',
        field: 'job',
        width: 120
      },
      {
        title: 'crm.partners.table.departmentName',
        field: 'departmentName',
        width: 120
      },
      {
        title: 'crm.partners.table.bankAccount',
        field: 'bankAccount',
        width: 200
      },
      {
        title: 'crm.partners.table.bankName',
        field: 'bankName',
        width: 200
      },
      {
        title: 'crm.partners.table.bankBranch',
        field: 'bankBranch',
        width: 200
      },
      {
        title: 'crm.partners.table.createdBy',
        field: 'createdBy',
        width: 120,
        show: false
      },
      {
        title: 'crm.partners.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.partners.table.modifiedBy',
        field: 'modifiedBy',
        width: 120,
        show: false
      },
      {
        title: 'crm.partners.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
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
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit
      }
    ];
  };
}


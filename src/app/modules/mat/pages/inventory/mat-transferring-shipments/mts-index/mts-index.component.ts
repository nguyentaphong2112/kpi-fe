import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTransferringShipmentsModel} from '../../../../data-access/models/inventory/mat-transferring-shipments.model';
import {
  MatTransferringShipmentsService
} from '../../../../data-access/services/inventory/mat-transferring-shipments.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from '@shared/constant/common';
import {UrlConstant as UrlConstantShare} from '@shared/constant/url.class';
import {DateValidator} from '@shared/custom-validator/dateValidator.class';
import {ActionSchema, ChildActionSchema} from '@core/models/action.model';
import {Constant} from '@app/modules/mat/data-access/constants/constants';
import {
  MtsFormComponent
} from '@app/modules/mat/pages/inventory/mat-transferring-shipments/mts-form/mts-form.component';

@Component({
  selector: 'app-mts-index',
  templateUrl: './mts-index.component.html',
  styleUrls: ['./mts-index.component.scss']
})


export class MtsIndexComponent extends BaseListComponent<MatTransferringShipmentsModel> implements OnInit {
  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/mat-transferring-shipments';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: MatTransferringShipmentsService
  ) {
    super(injector);
    this.initAction();
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.service.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason);
    this.approveAllApi = (data: any, afterUrl?: string) => this.service.approveAll(CommonUtils.convertDataSendToServer(data));
    this.serviceName = MICRO_SERVICE.MAT;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'transferringShipmentId';
    this.addWidth = 300;
    this.formConfig = {
      title: ' ',
      content: MtsFormComponent,
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [],
      warehouseId: [],
      pickingNo: [],
      receivedWarehouseId: [],
      name: [],
      statusId: [],
      fromDate: [],
      toDate: [],
    }, {
      validators:
        [DateValidator.validateRangeDate('fromDate', 'toDate', 'rangeDateError')]
    });
  }

  initAction(){
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.detail',
          icon: 'eye',
          function: this.doOpenFormDetail
        }),
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShowFn: (evt: any) => [Constant.STATUS_ENUM.DU_THAO, Constant.STATUS_ENUM.TU_CHOI].includes(evt.statusId),
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShowFn: (evt: any) => [Constant.STATUS_ENUM.DU_THAO].includes(evt.statusId),
          function: this.deleteItem
        }),
        new ChildActionSchema({
          label: 'common.button.sendApprove',
          icon: 'send',
          isShowFn: (evt: any) => [Constant.STATUS_ENUM.DU_THAO].includes(evt.statusId),
          function: this.sendToApprove
        }),
        new ChildActionSchema({
          label: 'common.button.approve',
          icon: 'check',
          isShowFn: (evt: any) => [Constant.STATUS_ENUM.CHO_DUYET].includes(evt.statusId),
          function: this.doApproveById
        }),
        new ChildActionSchema({
          label: 'common.button.rejectApprove',
          icon: 'close',
          isShowFn: (evt: any) => [Constant.STATUS_ENUM.CHO_DUYET].includes(evt.statusId),
          function: this.doRejectById
        })
      ]
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


override setHeaders() {
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
        title: 'mat.matTransferringShipments.table.pickingNo',
        field: 'pickingNo',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matTransferringShipments.table.name',
        field: 'name',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matTransferringShipments.table.warehouseId',
        field: 'transferredWarehouseName',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matTransferringShipments.table.receivedWarehouseId',
        field: 'receivedWarehouseName',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matTransferringShipments.table.statusId',
        field: 'statusName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matTransferringShipments.table.transferringDate',
        field: 'transferringDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matTransferringShipments.table.createdBy',
        field: 'createdBy',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matTransferringShipments.table.createdTime',
        field: 'createdTime',
        width: 120,
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
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
      }
    ];
  }

  sendToApprove = (data: MatTransferringShipmentsModel) => {
    this.subscriptions.push(
      this.service.approveByList([data[this.key]], '/send-to-approve').subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(this.translate.instant('common.notification.isSendToApprove'));
          this.search(this.pagination.pageNumber);
        } else {
          this.toast.error(res.message);
        }
      }, error => {
        this.toast.error(error.message);
      })
    );
  }
}


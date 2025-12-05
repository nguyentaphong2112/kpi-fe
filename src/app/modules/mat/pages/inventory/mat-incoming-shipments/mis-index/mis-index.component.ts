import {Component, Injector, OnInit} from '@angular/core';
import {MatIncomingShipmentsModel} from '../../../../data-access/models/inventory/mat-incoming-shipments.model';
import {MatIncomingShipmentsService} from '../../../../data-access/services/inventory/mat-incoming-shipments.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from '@shared/constant/common';
import {UrlConstant as UrlConstantShare} from '@shared/constant/url.class';
import {DateValidator} from '@shared/custom-validator/dateValidator.class';
import {Constant} from '@app/modules/mat/data-access/constants/constants';
import {ActionSchema, ChildActionSchema} from '@core/models/action.model';
import {MisFormComponent} from '@app/modules/mat/pages/inventory/mat-incoming-shipments/mis-form/mis-form.component';

@Component({
  selector: 'app-mis-index',
  templateUrl: './mis-index.component.html',
  styleUrls: ['./mis-index.component.scss']
})


export class MisIndexComponent extends BaseListComponent<MatIncomingShipmentsModel> implements OnInit {
  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/warehouses';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  typeList = Constant.TYPE;


  constructor(
    injector: Injector,
    private readonly service: MatIncomingShipmentsService
  ) {
    super(injector);
    this.initFormSearch();
    this.initAction();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.FORM_DATA, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string) => this.service.downloadFile(url);
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.service.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason);
    this.approveAllApi = (data: any, afterUrl?: string) => this.service.approveAll(CommonUtils.convertDataSendToServer(data));
    this.addWidth = 300;
    this.key = 'incomingShipmentId';
    this.formConfig = {
      title: ' ',
      content: MisFormComponent,
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [],
      pickingNo: [],
      warehouseId: [],
      type: [],
      statusId: [],
      fromDate: [],
      toDate: []
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
        title: 'mat.matIncomingShipments.table.pickingNo',
        field: 'pickingNo',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.table.warehouseId',
        field: 'warehouseName',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.table.incomingDate',
        field: 'incomingDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.table.type',
        field: 'typeName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.table.statusId',
        field: 'statusName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.table.contractNo',
        field: 'contractNo',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matIncomingShipments.table.pickingEmployeeId',
        field: 'pickingEmployeeName',
        width: 120,
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
        fixedDir: 'right'
      }
    ];
  }

  sendToApprove = (data: MatIncomingShipmentsModel) => {
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


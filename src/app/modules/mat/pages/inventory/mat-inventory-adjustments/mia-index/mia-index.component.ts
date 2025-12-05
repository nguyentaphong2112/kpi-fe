import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatInventoryAdjustmentsModel} from '../../../../data-access/models/inventory/mat-inventory-adjustments.model';
import {
  MatInventoryAdjustmentsService
} from '../../../../data-access/services/inventory/mat-inventory-adjustments.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from '@shared/constant/common';
import {UrlConstant as UrlConstantShare} from '@shared/constant/url.class';
import {DateValidator} from '@shared/custom-validator/dateValidator.class';
import {ActionSchema, ChildActionSchema} from '@core/models/action.model';
import {Constant} from '@app/modules/mat/data-access/constants/constants';
import {MatIncomingShipmentsModel} from '@app/modules/mat/data-access/models/inventory/mat-incoming-shipments.model';
import {Observable} from 'rxjs';
import {BaseResponse} from '@core/models/base-response';
import {MiaFormComponent} from '@app/modules/mat/pages/inventory/mat-inventory-adjustments/mia-form/mia-form.component';

@Component({
  selector: 'app-mia-index',
  templateUrl: './mia-index.component.html',
  styleUrls: ['./mia-index.component.scss']
})


export class MiaIndexComponent extends BaseListComponent<MatInventoryAdjustmentsModel> implements OnInit {
  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/mat-inventory-adjustments';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  senToApprove!: (listId: number[], afterUrl?: string) => Observable<BaseResponse<any>>;

  constructor(
    injector: Injector,
    private readonly service: MatInventoryAdjustmentsService
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
    this.senToApprove = (listId: number[], afterUrl?: string) => this.service.approveByList(listId, '/send-to-approve');
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.service.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason);
    this.approveAllApi = (data: any, afterUrl?: string) => this.service.approveAll(CommonUtils.convertDataSendToServer(data));
    this.serviceName = MICRO_SERVICE.MAT;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'inventoryAdjustmentId';
    this.addWidth = 300;
    this.formConfig = {
      title: ' ',
      content: MiaFormComponent,
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      inventoryAdjustmentNo: [null],
      warehouseId: [null],
      type: [null],
      statusId: [null],
      fromDate: [null],
      toDate: [null]
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
      el.checkDate = el.startDate + (el.endDate ? ' - ' + el.endDate : '');
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
        width: 20
      },
      {
        title: 'mat.matInventoryAdjustments.table.inventoryAdjustmentNo',
        field: 'inventoryAdjustmentNo',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matInventoryAdjustments.table.type',
        field: 'type',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matInventoryAdjustments.table.warehouseId',
        field: 'warehouseName',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matInventoryAdjustments.table.checkedEmployeeId',
        field: 'checkedEmployeeName',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matInventoryAdjustments.table.statusId',
        field: 'statusName',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matInventoryAdjustments.table.checkDate',
        field: 'checkDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matInventoryAdjustments.table.createdTime',
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

  sendToApprove = (data: MatIncomingShipmentsModel) => {
    this.subscriptions.push(
      this.senToApprove([data[this.key]]).subscribe(res => {
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


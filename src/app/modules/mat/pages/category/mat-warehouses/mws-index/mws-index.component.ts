import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatWarehousesModel} from '../../../../data-access/models/category/mat-warehouses.model';
import {MatWarehousesService} from '../../../../data-access/services/category/mat-warehouses.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from '@shared/constant/common';
import {UrlConstant as UrlConstantShare} from '@shared/constant/url.class';
import {ActionSchema, ChildActionSchema} from '@core/models/action.model';
import {Constant} from '@app/modules/mat/data-access/constants/constants';

@Component({
  selector: 'app-mws-index',
  templateUrl: './mws-index.component.html',
  styleUrls: ['./mws-index.component.scss']
})


export class MwsIndexComponent extends BaseListComponent<MatWarehousesModel> implements OnInit {
  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/mat-warehouses';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: MatWarehousesService
    // private readonly service: ResourcesService
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
    this.serviceName = MICRO_SERVICE.MAT;
    this.functionCode = Constant.FUNCTION_CODE.MAT_WAREHOUSES;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'warehouseId';
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [],
      code: [],
      name: [],
      type: [],
      equipmentTypeId: [],
      equipmentName: [],
    });
  }

  initAction(){
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.detail',
          icon: 'eye',
          // isShow: this.objFunction?.edit,
          function: this.doOpenFormDetail
        }),
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          // isShow: this.objFunction?.edit,
          function: this.doOpenFormEdit
        }),

        new ChildActionSchema({
          label: 'common.button.lock',
          icon: 'lock',
          disabled: (evt: any) => {
            return evt.statusId !== 'HOAT_DONG';
          },
          // isShow: this.objFunction?.edit,
          function: this.processLockWarehouse
        }),

        new ChildActionSchema({
          label: 'common.button.unlock',
          icon: 'unlock',
          disabled: (evt: any) => {
            return evt.statusId !== 'KHONG_HOAT_DONG';
          },
          // isShow: this.objFunction?.edit,
          function: this.processUnlockWarehouse
        }),
      ]
    });
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData = this.responseSearch.data;
  }

  override beforeExport() {
  }


  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        fixed: true,
        fixedDir: 'left',
        width: 50
      },
      {
        title: 'mat.matWarehouses.table.name',
        field: 'name',
        width: 150,
        isExpand: true,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.table.code',
        field: 'code',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.table.address',
        field: 'address',
        width: 150,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.table.departmentId',
        field: 'departmentName',
        width: 150,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.table.managerName',
        field: 'managerName',
        width: 120,
      },
      {
        title: 'mat.matWarehouses.table.type',
        field: 'typeName',
        width: 120,
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
        show: this.objFunction?.delete || this.objFunction?.edit,
      }
    ];
  }

  processUnlockWarehouse = (data: number) => {
    const action = () => {// on accepted
      this.service.lockOrUnlockById(data[this.key].toString(), '/lock-and-unlock').subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(
            this.translate.instant('common.notification.unlockSuccess')
          );
          this.search();
        }
      });
    };
    this.popupService.showModalConfirm(action, {
      title: 'Bạn có chắc muốn mở khóa bản ghi?'
    });
  }

  processLockWarehouse = (data: number) => {
    const action = () => {// on accepted
      this.service.lockOrUnlockById(data[this.key].toString(), '/lock-and-unlock').subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(
            this.translate.instant('common.notification.lockSuccess')
          );
          this.search();
        }
      });
    };
    this.popupService.showModalConfirm(action, {
      title: 'Bạn có chắc muốn khóa bản ghi?'
    });
  }
}


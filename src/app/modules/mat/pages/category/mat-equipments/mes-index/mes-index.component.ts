import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatEquipmentsModel } from '../../../../data-access/models/category/mat-equipments.model';
import { MatEquipmentsService } from '../../../../data-access/services/category/mat-equipments.service';
import { BaseListComponent } from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {
  ConfigFormComponent
} from "@app/modules/admin/pages/configurations/parameters/config-form/config-form.component";
import {MesFormComponent} from "@app/modules/mat/pages/category/mat-equipments/mes-form/mes-form.component";

@Component({
  selector: 'app-mes-index',
  templateUrl: './mes-index.component.html',
  styleUrls: ['./mes-index.component.scss']
})


export class MesIndexComponent extends BaseListComponent<MatEquipmentsModel> implements OnInit {
  serviceName = MICRO_SERVICE.MAT;
  urlLoadData = '/mat-equipments';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: MatEquipmentsService
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
    this.serviceName = MICRO_SERVICE.MAT;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'equipmentId';
    this.formConfig = {
      title: 'mat.matEquipments.titleConfig',
      content: MesFormComponent
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [],
      equipmentTypeId: [],
      name: [],
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
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        }),
      ]
    });
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      el.isSerialChecking = el.isSerialChecking === 'Y' ? 'Có' : 'Không';
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
        title: 'mat.matEquipments.table.code',
        field: 'code',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.equipmentTypeId',
        field: 'equipmentTypeName',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.equipmentGroupId',
        field: 'equipmentGroupName',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.name',
        field: 'name',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.description',
        field: 'description',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.equipmentUnitId',
        field: 'equipmentUnitName',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.warningDays',
        field: 'warningDays',
        width: 120,
        tdClassList: ['text-right'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.isSerialChecking',
        field: 'isSerialChecking',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.serialNo',
        field: 'serialNo',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.unitPrice',
        field: 'unitPrice',
        width: 120,
        tdClassList: ['text-right'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.location',
        field: 'location',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matEquipments.table.note',
        field: 'note',
        width: 120,
        thClassList: ['text-center'],
        show: false,
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
}


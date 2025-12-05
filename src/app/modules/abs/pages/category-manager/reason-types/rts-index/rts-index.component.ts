import { Component, HostListener, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {ReasonTypesModel} from '../../../../data-access/models/category-manager/reason-types.model';
import {ReasonTypesService} from '../../../../data-access/services/category-manager/reason-types.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {RtsFormComponent} from "@app/modules/abs/pages/category-manager/reason-types/rts-form/rts-form.component";

@Component({
  selector: 'app-rts-index',
  templateUrl: './rts-index.component.html',
  styleUrls: ['./rts-index.component.scss']
})


export class RtsIndexComponent extends BaseListComponent<ReasonTypesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ABS;
  urlLoadData = '/reason-types';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: ReasonTypesService
  ) {
    super(injector);
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
    this.serviceName = MICRO_SERVICE.ABS;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'reasonTypeId';

    this.formConfig = {
      title: 'abs.reasonTypes.pageName',
      content: RtsFormComponent
    };

  }



  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null]
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
    this.tableConfig.key = this.key;
    this.tableConfig.showSelect = true;
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
          title: 'abs.reasonTypes.table.code',
          field: 'code',
          width: 120,
        },
        {
          title: 'abs.reasonTypes.table.name',
          field: 'name',
          width: 120,
        },
        {
          title: 'abs.reasonTypes.table.isOverHoliday',
          field: 'isOverHoliday',
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
      ]
    };
  }


import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FamilyRelationshipsModel } from '../../../../data-access/models/hrm-managers/family-relationships.model';
import { FamilyRelationshipsService } from '../../../../data-access/services/hrm-managers/family-relationships.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";

@Component({
  selector: 'app-frs-index',
  templateUrl: './frs-index.component.html',
  styleUrls: ['./frs-index.component.scss']
})


export class FrsIndexComponent extends BaseListComponent<FamilyRelationshipsModel> implements OnInit {
  serviceName = MICRO_SERVICE.CRM;
  urlLoadData = '/family-relationships';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: FamilyRelationshipsService
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
    this.serviceName = MICRO_SERVICE.CRM;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'resourceId';
  }

  initFormSearch() {
    this.form = this.fb.group({
      code: [null],
      flagStatus: [1],
      flagStatus1: [],
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
        width: 20
      },

        {
          title: 'crm.familyRelationships.table.familyRelationshipId',
          field: 'familyRelationshipId',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.familyRelationships.table.objectType',
          field: 'objectType',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.familyRelationships.table.objectId',
          field: 'objectId',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.familyRelationships.table.relationTypeId',
          field: 'relationTypeId',
          width: 120,
        },
        {
          title: 'crm.familyRelationships.table.dateOfBirth',
          field: 'dateOfBirth',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.familyRelationships.table.fullName',
          field: 'fullName',
          width: 120,
        },
        {
          title: 'crm.familyRelationships.table.mobileNumber',
          field: 'mobileNumber',
          width: 120,
        },
        {
          title: 'crm.familyRelationships.table.email',
          field: 'email',
          width: 120,
        },
        {
          title: 'crm.familyRelationships.table.zaloAccount',
          field: 'zaloAccount',
          width: 120,
        },
        {
          title: 'crm.familyRelationships.table.facebookAccount',
          field: 'facebookAccount',
          width: 120,
        },
        {
          title: 'crm.familyRelationships.table.currentAddress',
          field: 'currentAddress',
          width: 120,
        },
        {
          title: 'crm.familyRelationships.table.isDeleted',
          field: 'isDeleted',
          width: 120,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.familyRelationships.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'crm.familyRelationships.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.familyRelationships.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'crm.familyRelationships.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'crm.familyRelationships.table.lastUpdateTime',
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


import {Component, Injector, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TaxCommitmentsModel} from '../../../../data-access/models/commitments/tax-commitments.model';
import {TaxCommitmentsService} from '../../../../data-access/services/commitments/tax-commitments.service';
import {BaseListComponent} from '@core/components/base-list.component';
import {MICRO_SERVICE} from '@core/constant/system.constants';
import {CommonUtils} from '@shared/services/common-utils.service';
import {REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {Scopes} from "@core/utils/common-constants";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";
import {TcsFormComponent} from "@app/modules/pit/pages/commitments/tax-commitments/tcs-form/tcs-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";

@Component({
  selector: 'app-tcs-index',
  templateUrl: './tcs-index.component.html',
  styleUrls: ['./tcs-index.component.scss']
})


export class TcsIndexComponent extends BaseListComponent<TaxCommitmentsModel> implements OnInit {
  serviceName = MICRO_SERVICE.PIT;
  urlLoadData = '/tax-commitments';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  isShowAdvSearch = false;
  visibleActionsCount = 0;
  actionSchemaHeader: ActionSchema;
  @Input() scope: string = Scopes.VIEW;
  urlConstant = UrlConstant;

  constructor(
    injector: Injector,
    private readonly service: TaxCommitmentsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.importApi = (body) => this.service.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.downLoadTemplateApi = () => this.service.downloadFile('/download-template');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.service.downloadFileByName(url, { fileName: fileName });
    this.approveByListApi = (listId: number[], afterUrl?: string) => this.service.approveByList(listId);
    this.rejectByListApi = (listId: number[], rejectReason: string, afterUrl?: string) => this.service.rejectByList(listId, rejectReason);
    this.approveAllApi = (data: any, afterUrl?: string) => this.service.approveAll(CommonUtils.convertDataSendToServer(data));
    this.serviceName = MICRO_SERVICE.PIT;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'resourceId';

    this.formConfig = {
      title: 'pit.breadcrumb.taxCommitments',
      content: TcsFormComponent
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      orgId: [null],
      keySearch: [null],
      startDate: [null],
      endDate: [null],
    },{
      validators: [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
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



  override setHeaders() {
    this.tableConfig.key = this.key;
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
          title: 'pit.taxCommitments.table.employeeCode',
          field: 'employeeCode',
          width: 100,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
      {
          title: 'pit.taxCommitments.table.fullName',
          field: 'fullName',
          width: 120,
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxCommitments.table.incomeAmount',
          field: 'incomeAmount',
          width: 135,
          tdClassList: ['text-right'],
          fieldType: 'pipe',
          fieldTypeValue: 'currency',
          thFilter: true,
          filterType: 'number'
        },
        {
          title: 'pit.taxCommitments.table.startDate',
          field: 'startDate',
          width: 80,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxCommitments.table.endDate',
          field: 'endDate',
          width: 80,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxCommitments.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'pit.taxCommitments.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxCommitments.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'pit.taxCommitments.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'pit.taxCommitments.table.description',
          field: 'description',
          width: 220,
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


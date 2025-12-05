import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ContributionRatesModel } from '../../../../data-access/models/configs/contribution-rates.model';
import { ContributionRatesService } from '../../../../data-access/services/configs/contribution-rates.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import {Mode, REQUEST_TYPE} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {FunctionCode} from "@shared/enums/enums-constant";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";
import {ObjectUtil} from "@core/utils/object.util";
import {Constant} from "@app/modules/icn/data-access/constants/constant";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {CrsFormComponent} from "@app/modules/icn/pages/configs/contribution-rates/crs-form/crs-form.component";

@Component({
  selector: 'app-crs-index',
  templateUrl: './crs-index.component.html',
  styleUrls: ['./crs-index.component.scss']
})


export class CrsIndexComponent extends BaseListComponent<ContributionRatesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ICN;
  urlLoadData = '/contribution-rates';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE
  functionCode = FunctionCode.ICN_CONTRIBUTION_RATES;
  listEmpTypeCode = ObjectUtil.optionsToList(Constant.ListEmpTypeCode);
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  @ViewChild('usedTimeTmpl', { static: true }) usedTimeTmpl!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: ContributionRatesService
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
    this.serviceName = MICRO_SERVICE.ICN;
    this.urlApiDownloadTemp = '';
    this.urlApiImport = '';
    this.key = 'contributionRateId';
    this.formConfig = {
      content:CrsFormComponent,
      title:'icn.contributionRates.title'
    }
  }

  initFormSearch() {
    this.form = this.fb.group({
      listEmpTypeCode: [null],
      startDate: [null],
      endDate: [null]
    },{
      validators:[DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
    });
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
          isShow: this.objFunction?.edit,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        })]
    })
  }

  override beforeSearch() {
    const formValue = CommonUtils.convertDataSendToServer(this.form.value);
    if (Array.isArray(formValue.listEmpTypeCode)) {
      formValue.empTypeCode = formValue.listEmpTypeCode.join(',');
    }
    this.params = formValue
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
          title: 'icn.contributionRates.table.empTypeCode',
          field: 'empTypeCode',
          width: 120,
        },
      {
        title: 'icn.contributionRates.table.usedTime',
        fieldType:'tdTemplate',
        fieldTypeValue: this.usedTimeTmpl,
        width: 250,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
        {
          title: 'icn.contributionRates.table.unitSocialPercent',
          field: 'unitSocialPercent',
          width: 120,
          tdClassList: ['text-right'],
          thClassList: ['text-center']
        },
        {
          title: 'icn.contributionRates.table.perSocialPercent',
          field: 'perSocialPercent',
          width: 120,
          tdClassList: ['text-right'],
          thClassList: ['text-center']
        },
        {
          title: 'icn.contributionRates.table.unitMedicalPercent',
          field: 'unitMedicalPercent',
          width: 120,
          tdClassList: ['text-right'],
          thClassList: ['text-center']
        },
        {
          title: 'icn.contributionRates.table.perMedicalPercent',
          field: 'perMedicalPercent',
          width: 120,
          tdClassList: ['text-right'],
          thClassList: ['text-center']
        },
        {
          title: 'icn.contributionRates.table.unitUnempPercent',
          field: 'unitUnempPercent',
          width: 120,
          tdClassList: ['text-right'],
          thClassList: ['text-center']
        },
        {
          title: 'icn.contributionRates.table.perUnempPercent',
          field: 'perUnempPercent',
          width: 120,
          tdClassList: ['text-right'],
          thClassList: ['text-center']
        },
        {
          title: 'icn.contributionRates.table.unitUnionPercent',
          field: 'unitUnionPercent',
          width: 120,
          tdClassList: ['text-right'],
          thClassList: ['text-center']
        },
        {
          title: 'icn.contributionRates.table.perUnionPercent',
          field: 'perUnionPercent',
          width: 120,
          tdClassList: ['text-right'],
          thClassList: ['text-center']
        },

        {
          title: 'icn.contributionRates.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'icn.contributionRates.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'icn.contributionRates.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'icn.contributionRates.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'icn.contributionRates.table.lastUpdateTime',
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

  protected readonly Mode = Mode;
}


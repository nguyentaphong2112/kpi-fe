import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InsuranceRetractionsModel } from '../../../../data-access/models/caculate/insurance-retractions.model';
import { InsuranceRetractionsService } from '../../../../data-access/services/caculate/insurance-retractions.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { CATEGORY_CODE, REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant as UrlConstantShare } from '@shared/constant/url.class';
import { Scopes } from '@core/utils/common-constants';
import { ObjectUtil } from '@core/utils/object.util';
import { Constant } from '@app/modules/icn/data-access/constants/constant';
import { MakeListComponent } from '@app/modules/icn/pages/caculate/insurance-retractions/make-list/make-list.component';
import { FunctionCode } from '@shared/enums/enums-constant';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';

@Component({
  selector: 'app-irs-index',
  templateUrl: './irs-index.component.html',
  styleUrls: ['./irs-index.component.scss']
})


export class sIndexComponent extends BaseListComponent<InsuranceRetractionsModel> implements OnInit {
  serviceName = MICRO_SERVICE.ICN;
  urlLoadData = '/insurance-retractions';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  functionCode = FunctionCode.ICN_INSURANCE_RETRACTIONS;
  isShowAdvSearch = false;
  scope = Scopes.CREATE;
  urlLoadEmpTypeList = UrlConstant.EMP_TYPES.GET_LIST;
  listStatus = ObjectUtil.optionsToList(Constant.SelectArrearsPrePeriodStatus);
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly service: InsuranceRetractionsService
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
    this.key = 'resourceId';
  }

  initFormSearch() {
    this.form = this.fb.group({
        orgId: [null],
        periodDate: [null],
        keySearch: [null],
        listEmpTypeCode: [null],
        listType: [null],
        listStatus: [null]
      }
    );
  }

  onMakeList(data?: any) {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() + (this.addWidth ? this.addWidth : 0),
      nzTitle: this.translate.instant('icn.insuranceRetractions.label.makeList'),
      nzContent: MakeListComponent,
      nzComponentParams: {
        data
      },
      nzFooter: this.footerTpl ?? null
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.search();
        }
      }
    );
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
        width: 50,
        rowspan: 2
      },
      {
        title: 'icn.insuranceRetractions.table.employeeCode',
        field: 'employeeCode',
        width: 120,
        thClassList: ['text-center'],
        rowspan: 2
      },
      {
        title: 'icn.insuranceRetractions.table.fullName',
        field: 'fullName',
        width: 120,
        thClassList: ['text-center'],
        rowspan: 2
      },
      {
        title: 'icn.insuranceRetractions.table.reason',
        field: 'reason',
        rowspan: 2,
        width: 120
      },
      {
        title: 'icn.insuranceRetractions.table.periodDate',
        field: 'periodDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        rowspan: 2
      },
      {
        title: 'icn.insuranceRetractions.table.retroPeriodDate',
        field: 'retroPeriodDate',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        rowspan: 2
      },
      {
        title: 'icn.insuranceRetractions.table.totalSalaryContributions',
        field: 'totalSalaryContributions',
        width: 120,
        colspan: 5,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.insuranceRetractions.table.contractSalary',
            field: 'contractSalary',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          },
          {
            title: 'icn.insuranceRetractions.table.reserveSalary',
            field: 'reserveSalary',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          },
          {
            title: 'icn.insuranceRetractions.table.posAllowanceSalary',
            field: 'posAllowanceSalary',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          },
          {
            title: 'icn.insuranceRetractions.table.senioritySalary',
            field: 'senioritySalary',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          },
          {
            title: 'icn.insuranceRetractions.table.posSenioritySalary',
            field: 'posSenioritySalary',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          }
        ]
      },
      {
        title: 'icn.insuranceRetractions.table.social',
        field: 'social',
        width: 120,
        colspan: 2,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.insuranceRetractions.table.perSocialAmount',
            field: 'perSocialAmount',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          },
          {
            title: 'icn.insuranceRetractions.table.unitSocialAmount',
            field: 'unitSocialAmount',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          }
        ]
      },
      {
        title: 'icn.insuranceRetractions.table.medical',
        field: 'medical',
        width: 120,
        colspan: 2,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.insuranceRetractions.table.perMedicalAmount',
            field: 'perMedicalAmount',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          },
          {
            title: 'icn.insuranceRetractions.table.unitMedicalAmount',
            field: 'unitMedicalAmount',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          }
        ]
      },
      {
        title: 'icn.insuranceRetractions.table.unemp',
        field: 'unemp',
        width: 120,
        colspan: 2,
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        child: [
          {
            title: 'icn.insuranceRetractions.table.perUnempAmount',
            field: 'perUnempAmount',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          },
          {
            title: 'icn.insuranceRetractions.table.unitUnempAmount',
            field: 'unitUnempAmount',
            width: 120,
            fieldType: 'pipe',
            fieldTypeValue: 'currency',
            tdClassList: ['text-right'],
            thClassList: ['text-center']
          }
        ]
      },
      {
        title: 'icn.insuranceRetractions.table.totalAmount',
        field: 'totalAmount',
        width: 120,
        rowspan: 2,
        fieldType: 'pipe',
        fieldTypeValue: 'currency',
        tdClassList: ['text-right'],
        thClassList: ['text-center']
      },
      {
        title: 'icn.insuranceRetractions.table.empTypeCode',
        field: 'empTypeName',
        rowspan: 2,
        width: 120
      },
      {
        title: 'icn.insuranceRetractions.table.jobName',
        field: 'jobName',
        rowspan: 2,
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'icn.insuranceRetractions.table.orgName',
        field: 'orgName',
        rowspan: 2,
        width: 120,
        thClassList: ['text-center']
      }
    ];
  };

  protected readonly CATEGORY_CODE = CATEGORY_CODE;
  protected readonly MICRO_SERVICE = MICRO_SERVICE;
}


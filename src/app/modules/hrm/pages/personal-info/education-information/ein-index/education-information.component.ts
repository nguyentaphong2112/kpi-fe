import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { AppFunction } from '@core/models/app-function.interface';
import { FunctionCode } from '@shared/enums/enums-constant';
import { BaseResponse } from '@app/core/models/base-response';
import { EmployeesInfo, InfoDetailBean } from '@app/modules/hrm/data-access/models/employee-info';
import { BaseListComponent } from '@core/components/base-list.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { HBTTableConfig } from '@shared/component/hbt-table/hbt-table.interfaces';
import { TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { EdsFormComponent } from '@app/modules/hrm/pages/staff-research/education-degrees/eds-form/eds-form.component';
import {
  EceFormComponent
} from '@app/modules/hrm/pages/staff-research/education-certificate/ece-form/ece-form.component';
import { EpsFormComponent } from '@app/modules/hrm/pages/staff-research/education-process/eps-form/eps-form.component';
import {
  EpnFormComponent
} from '@app/modules/hrm/pages/staff-research/education-promotion/epn-form/epn-form.component';
import {
  EducationPromotionsService
} from '@app/modules/hrm/data-access/services/staff-research/education-promotions.service';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import {
  EducationDegreesService
} from '@app/modules/hrm/data-access/services/staff-research/education-degrees.service';
import {
  EducationCertificatesService
} from '@app/modules/hrm/data-access/services/staff-research/education-certificates.service';
import {
  EducationProcessService
} from '@app/modules/hrm/data-access/services/staff-research/education-process.service';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './education-information.component.html',
  styleUrls: ['./education-information.component.scss']
})
export class EducationInformationComponent extends BaseListComponent<NzSafeAny> implements OnInit, OnDestroy {
  objFunctionDegree: AppFunction;
  objFunctionCertificate: AppFunction;
  objFunctionProcess: AppFunction;
  objFunctionPromotion: AppFunction;
  items: EmployeesInfo | NzSafeAny;
  subs: Subscription[] = [];
  response: BaseResponse<any> = new BaseResponse();
  eduInfos: InfoDetailBean[] = [];
  isDetail = false;
  employeeId: any;

  tableDataDegree: NzSafeAny[] = [];
  tableDataCertificate: NzSafeAny[] = [];
  tableDataProcess: NzSafeAny[] = [];
  tableDataPromotion: NzSafeAny[] = [];

  tableEducationCertificate: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  tableEducationProcess: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  tableEducationPromotion: HBTTableConfig = {
    headers: [],
    total: 0,
    needScroll: true,
    loading: false,
    size: 'small',
    pageSize: TABLE_CONFIG_DEFAULT.pageSize,
    pageIndex: 1,
    showFrontPagination: false
  };

  @Input() data: any;

  constructor(
    injector: Injector,
    private educationDegreesService: EducationDegreesService,
    private educationCertificatesService: EducationCertificatesService,
    private educationProcessService: EducationProcessService,
    private alertModalChangeService: AlertModalChangeService,
    private educationPromotionService: EducationPromotionsService
  ) {
    super(injector);
    this.isCustomSearch = true;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunctionDegree = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_EDUCATION_DEGREES}`);
    this.objFunctionCertificate = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_EDUCATION_CERTIFICATES}`);
    this.objFunctionProcess = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_DISCIPLINE_PROCESS}`);
    this.objFunctionPromotion = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.PERSONAL_EDUCATION_PROMOTIONS}`);
    this.initAction();
    this.employeeId = 1;
  }

  showPersonalInfo() {
    this.eduInfos = this.data?.eduInfo;
    return this.eduInfos;
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShowFn: this.isShowEdit,
          function: this.doOpenFormEditCustom
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShowFn: this.isShowDelete,
          function: this.deleteItemCustom
        })
      ]
    });
  }

  isShowEdit = (data: any): boolean => {
    if (data.tableType === 'degree') {
      return this.objFunctionDegree?.edit;
    }
    if (data.tableType === 'certificate') {
      return this.objFunctionCertificate?.edit;
    }
    if (data.tableType === 'process') {
      return this.objFunctionProcess?.edit;
    }
    if (data.tableType === 'promotions') {
      return this.objFunctionPromotion?.edit;
    }
    return true;
  };

  isShowDelete = (data: any): boolean => {
    if (data.tableType === 'degree') {
      return this.objFunctionDegree?.delete;
    }
    if (data.tableType === 'certificate') {
      return this.objFunctionCertificate?.delete;
    }
    if (data.tableType === 'process') {
      return this.objFunctionProcess?.delete;
    }
    if (data.tableType === 'promotions') {
      return this.objFunctionPromotion?.edit;
    }
    return true;
  };

  doOpenFormCustom(type: string) {
    const formConfigMap: { [key: string]: any } = {
      degree: {
        title: 'hrm.staffManager.staffResearch.pageName.educationDegreesInfo',
        content: EdsFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      },
      certificate: {
        title: 'hrm.staffManager.staffResearch.pageName.educationCertificatesInfo',
        content: EceFormComponent, config: UrlConstant.EMPLOYEES.PERSONAL
      },
      process: {
        title: 'hrm.staffManager.staffResearch.pageName.educationProcessInfo',
        content: EpsFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      },
      promotions: {
        title: 'hrm.staffManager.staffResearch.pageName.educationPromotionInfo',
        content: EpnFormComponent,
        config: UrlConstant.EMPLOYEES.PERSONAL
      }
    };

    this.formConfig = formConfigMap[type];
    this.doOpenForm(this.modeConst.ADD, { hiddenEmp: true, employeeId: this.employeeId });
  }

  deleteItemCustom = (data: any) => {
    if (data.tableType === 'degree') {
      this.key = 'educationDegreeId';
      this.deleteApi = (id: number | string) => this.educationDegreesService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    if (data.tableType === 'certificate') {
      this.key = 'educationCertificateId';
      this.deleteApi = (id: number | string) => this.educationCertificatesService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    if (data.tableType === 'process') {
      this.key = 'educationProcessId';
      this.deleteApi = (id: number | string) => this.educationProcessService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    if (data.tableType === 'promotions') {
      this.key = 'educationPromotionId';
      this.deleteApi = (id: number | string) => this.educationPromotionService.deleteById(id.toString(), UrlConstant.EMPLOYEES.PERSONAL);
    }
    this.deleteItem(data);
  };


  doOpenFormEditCustom = (data: any) => {
    if (data.tableType === 'degree') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.educationDegreesInfo',
        content: EdsFormComponent, config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    if (data.tableType === 'certificate') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.educationCertificatesInfo',
        content: EceFormComponent, config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    if (data.tableType === 'process') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.educationProcessInfo',
        content: EpsFormComponent, config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    if (data.tableType === 'promotions') {
      this.formConfig = {
        title: 'hrm.staffManager.staffResearch.pageName.educationPromotionInfo',
        content: EpnFormComponent, config: UrlConstant.EMPLOYEES.PERSONAL
      };
    }
    this.doOpenFormEdit({ ...data, hiddenEmp: true });
  };

  search(page?: number, type = '', isAlertModal = true) {
    if (isAlertModal) {
      this.alertModalChangeService.closePersonalInfo();
    }
    this.pagination.pageNumber = page ?? 1;
    if ((type === 'degree' || type === '') && this.objFunctionDegree?.view) {
      this.educationDegreesService.getEducationDegrees(null, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataDegree = res.data.listData.map(el => {
          return { ...el, tableType: 'degree' };
        });
        this.tableConfig.total = res.data.total;
        this.tableConfig.pageIndex = res.data.pageIndex;
      });
    }
    if ((type === 'certificate' || type === '') && this.objFunctionCertificate?.view) {
      this.educationCertificatesService.getEducationCertificates(null, this.pagination.getCurrentPage()).subscribe((res => {
        this.tableDataCertificate = res.data.listData.map(el => {
          return { ...el, tableType: 'certificate' };
        });
        this.tableEducationCertificate.total = res.data.total;
        this.tableEducationCertificate.pageIndex = res.data.pageIndex;
      }));
    }
    if ((type === 'process' || type === '') && this.objFunctionProcess?.view) {
      this.educationProcessService.getEducationProcess(null, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataProcess = res.data.listData.map(el => {
          return { ...el, tableType: 'process' };
        });
        this.tableEducationProcess.total = res.data.total;
        this.tableEducationProcess.pageIndex = res.data.pageIndex;
      });
    }
    if ((type === 'promotions' || type === '') && this.objFunctionPromotion?.view) {
      this.educationPromotionService.getEducationPromotions(null, this.pagination.getCurrentPage()).subscribe(res => {
        this.tableDataPromotion = res.data.listData.map(el => {
          return { ...el, tableType: 'promotions' };
        });
        this.tableEducationPromotion.total = res.data.total;
        this.tableEducationPromotion.pageIndex = res.data.pageIndex;
      });
    }
  }

  viewDetail() {
    this.isDetail = !this.isDetail;
    if (this.isDetail) {
      this.search(1, '', false);
    }
  }

  override setHeaders() {
    this.tableConfig.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.graduatedYear',
        field: 'graduatedYear',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 80
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.trainingSchoolName',
        field: 'trainingSchoolName'
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.majorLevelName',
        field: 'majorLevelName',
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.majorName',
        field: 'majorName'
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.graduatedRankName',
        field: 'graduatedRankName',
        width: 150
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.isHighest',
        field: 'isHighest',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'common.label.createdBy',
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.createdTime',
        tdClassList: ['text-center'],
        field: 'createdTime',
        width: 120,
        show: false
      },
      {
        title: 'common.label.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.modifiedTime',
        tdClassList: ['text-center'],
        field: 'modifiedTime',
        width: 120,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];

    this.tableEducationCertificate.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.certificateTypeName',
        field: 'certificateTypeName'
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.certificateName',
        field: 'certificateName'
      },
      {
        title: 'hrm.staffManager.educationCertificates.table.certificateResult',
        field: 'result',
        width: 120
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.issueDate',
        field: 'issuedDate',
        tdClassList: ['text-center'],
        width: 200
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.issuePlace',
        field: 'issuedPlace',
        width: 200
      },
      {
        title: 'hrm.staffManager.staffResearch.degree.label.expiredDate',
        field: 'expiredDate',
        tdClassList: ['text-center'],
        width: 200
      },
      {
        title: 'common.label.createdBy',
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.createdTime',
        tdClassList: ['text-center'],
        field: 'createdTime',
        width: 120,
        show: false
      },
      {
        title: 'common.label.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.modifiedTime',
        tdClassList: ['text-center'],
        field: 'modifiedTime',
        width: 120,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];

    this.tableEducationProcess.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.staffResearch.eduHis.table.courseName',
        field: 'courseName'
      },
      {
        title: 'hrm.staffManager.staffResearch.eduHis.table.eduMethodTypeName',
        field: 'trainingMethodName'
      }, {
        title: 'hrm.staffManager.staffResearch.eduHis.table.courseContent',
        field: 'courseContent'
      },
      {
        title: 'hrm.staffManager.staffResearch.eduHis.table.trainingMethodPlace',
        field: 'trainingMethodPlace'
      },
      {
        title: 'common.label.createdBy',
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.createdTime',
        tdClassList: ['text-center'],
        field: 'createdTime',
        width: 120,
        show: false
      },
      {
        title: 'common.label.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'common.label.modifiedTime',
        tdClassList: ['text-center'],
        field: 'modifiedTime',
        width: 120,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
    this.tableEducationPromotion.headers = [
      {
        title: 'STT',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        fixedDir: 'left',
        width: 50,
        fixed: window.innerWidth > 1024
      },
      {
        title: 'hrm.staffManager.educationPromotions.table.issuedYear',
        field: 'issuedYear',
        width: 250,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.educationPromotions.table.promotionRankName',
        field: 'promotionRankName'
      },
      {
        title: 'common.label.createdBy',
        field: 'createdBy',
        width: 150
      },
      {
        title: 'common.label.createdTime',
        tdClassList: ['text-center'],
        field: 'createdTime',
        width: 150
      },
      {
        title: 'common.label.modifiedBy',
        field: 'modifiedBy',
        width: 150
      },
      {
        title: 'common.label.modifiedTime',
        tdClassList: ['text-center'],
        field: 'modifiedTime',
        width: 150
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }


}

import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { EmployeeEvaluationsModel } from '../../../../data-access/models/kpi-evaluations/employee-evaluations.model';
import {
  EmployeeEvaluationsService
} from '../../../../data-access/services/kpi-evaluations/employee-evaluations.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { Scopes } from '@core/utils/common-constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import {
  EmployeeWorkPlanningsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/employee-work-plannings.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  EvaluationCriteriaComponent
} from '@app/modules/kpi/pages/kpi-evaluations/employee-evaluations/evaluation-criteria/evaluation-criteria.component';

import { BaseResponse } from '@core/models/base-response';
import _ from 'lodash';
import { firstValueFrom } from 'rxjs';
import { ScrollSpyDirective } from '@shared/directive/scroll-spy.directive';
import { MbCollapseComponent } from '@shared/component/hbt-collapse/hbt-collapse.component';
import { FunctionCode } from '@shared/enums/enums-constant';
import { EmployeesService } from '@app/modules/hrm/data-access/services/staff-info/employees.service';

@Component({
  selector: 'pes-form',
  templateUrl: './ees-form.component.html',
  styleUrls: ['./ees-form.component.scss']
})
export class EesFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  employeeCode = '';
  employeeName = '';
  serviceName = MICRO_SERVICE.KPI;
  urlLoadData = '/employee-evaluations';
  scope = Scopes.VIEW;
  employeeWorkPlanning: any;
  isVisible = false;
  isDuplicate = false;
  valueInput = '';
  tabs = [];
  title = this.translate.instant('kpi.employeeEvaluations.label.workPlanAdd');
  isDetail = false;
  isEvaluate = false;
  isEvaluateManage = false;
  isEvaluateDetail = false;
  public panels: NzSafeAny[] = [];
  public scrollTabs: NzSafeAny = [];
  empInfo = null;
  employeeId = null;
  isOne = false;
  empEvaluationIds = [];

  // @ViewChild(NzTabSetComponent) tabSet: NzTabSetComponent;
  // @ViewChild(EvaluationCriteriaComponent) empEvaluationCriteria: EvaluationCriteriaComponent;
  // @ViewChildren(WorkPlanComponent) empWorkPlans: QueryList<WorkPlanComponent>;
  @ViewChild('collapse') collapse!: MbCollapseComponent;
  @ViewChild(ScrollSpyDirective) scrollSpy: ScrollSpyDirective;

  constructor(
    private readonly service: EmployeeEvaluationsService,
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeesService,
    private readonly empWorkPlanningService: EmployeeWorkPlanningsService,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'employeeEvaluationId';
    this.isDetail = this.route.snapshot.queryParams.isDetail;
    this.isEvaluate = this.route.snapshot.queryParams.isEvaluate;
    this.isEvaluateManage = this.route.snapshot.queryParams.isEvaluateManage;
    this.isEvaluateDetail = this.route.snapshot.queryParams.isEvaluateDetail;
    this.employeeId = this.route.snapshot.queryParams.employeeId;
    this.findOneById = (id) => this.empWorkPlanningService.findOneById(id);
    this.createApi = (body: EmployeeEvaluationsModel) => this.empWorkPlanningService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: EmployeeEvaluationsModel) => this.empWorkPlanningService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
  }

  async ngOnInit() {
    await this.getDataEmp();
    this.employeeName = this.route.snapshot.queryParams.employeeName;
    this.employeeCode = this.route.snapshot.queryParams.employeeCode;
    // this.patchValue();
    this.getPanels();
    super.ngOnInit();
  }

  async getDataEmp() {
    // this.service.findOneById(this.employeeId, '/get-data-emp').subscribe(res => {
    //   if (res.code === HTTP_STATUS_CODE.SUCCESS) {
    //     this.empInfo = res.data;
    //   }
    // });
    try {
      const res = await firstValueFrom(this.service.findOneById(this.employeeId, '/get-data-emp'));
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.empInfo = res.data;
      }
    } catch (error) {
      console.error('Error while validating:', error);
    }
  }

  export() {
    this.employeeService.export({}, UrlConstant.EMPLOYEES.EXPORT + '/' + this.employeeId, false).toPromise();
  }

  getPanels() {
    const panels: any[] = [{
      id: 'evaluation_criteria',
      active: true,
      disabled: false,
      icon: null,
      code: FunctionCode.EVALUATION_CRITERIA,
      name: '',
      dataValid: this.empInfo,
      panelComponent: EvaluationCriteriaComponent,
      orderNumber: 0
    }];
    this.scrollTabs = [{
      title: 'kpi.kpiEvaluations.organizations.label.evaluationCriteria',
      code: FunctionCode.EVALUATION_CRITERIA,
      scrollTo: 'evaluation_criteria'
    }];
    // for (let index = 0; index < this.tabs.length; index++) {
    //   const it = this.tabs[index];
    //   if (it.percent != 0) {
    //     let name = it.name + ((it.percent != null && !this.isOne) ? ' (' + it.percent + '%)' : '');
    //     panels.push({
    //       id: 'work_plan' + index,
    //       active: true,
    //       disabled: false,
    //       icon: null,
    //       code: FunctionCode.WORK_PLAN + index,
    //       name: name,
    //       panelComponent: WorkPlanComponent,
    //       data: {
    //         ...it,
    //         isOne: this.isOne,
    //         isProbationary: this.empInfo.isProbationary,
    //         isJobFree: this.empInfo.isJobFree,
    //         empEvaluationIds: this.empEvaluationIds
    //       },
    //       orderNumber: index + 1
    //     });
    //     this.scrollTabs.push({
    //       title: name,
    //       code: FunctionCode.WORK_PLAN + index,
    //       scrollTo: 'work_plan' + index
    //     });
    //   }
    // }
    this.collapse.setPanels(panels);
    setTimeout(() => {
      this.panels = panels;
      this.panels.forEach(panel => {
        this.collapse.setReference(panel.componentRef, panel.id);
      });
      this.cdr.detectChanges();
      this.scrollSpy.collectIds();
      this.scrollSpy.setLink(0);
    });
  }

  patchValue() {
    this.service.findOneById(this.route.snapshot.queryParams.employeeEvaluationId, UrlConstant.EMPLOYEE_EVALUATION.WORK_PLANNING).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        if (res.data.listData.length > 0) {
          this.tabs = [...res.data.listData];
          this.empEvaluationIds = res.data.empEvaluationIds;
          if (this.tabs.length == 1) {
            this.isOne = true;
          }
          this.getPanels();
        }
      }
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.valueInput = '';
    this.isSubmitted = false;
    this.isDuplicate = false;
  }

  handleOk(): void {
    this.isSubmitted = true;
    this.isDuplicate = false;
    if (this.tabs.find(it => it.name == this.valueInput.trim()) && this.valueInput.trim() != this.employeeWorkPlanning?.name) {
      this.isDuplicate = true;
    }
    if (this.valueInput.trim() && !this.isDuplicate) {
      if (this.employeeWorkPlanning) {
        this.employeeWorkPlanning.name = this.valueInput;
        this.employeeWorkPlanning.id = this.employeeWorkPlanning.employeeWorkPlanningId;
        this.empWorkPlanningService.update(this.employeeWorkPlanning, REQUEST_TYPE.FORM_DATA).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(
              this.translate.instant('common.notification.updateSuccess')
            );
            this.patchValue();
            this.handleCancel();
          }
        });
      } else {
        this.employeeWorkPlanning = {};
        this.employeeWorkPlanning.name = this.valueInput;
        this.employeeWorkPlanning.employeeEvaluationId = this.route.snapshot.queryParams.employeeEvaluationId;
        this.employeeWorkPlanning.orderNumber = this.tabs.length + 1;
        this.empWorkPlanningService.createOrImport(this.employeeWorkPlanning, REQUEST_TYPE.FORM_DATA).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(
              this.translate.instant('common.notification.addSuccess')
            );
            this.patchValue();
            this.handleCancel();
          }
        });
      }
    }
  }

  closeTab(index: number): void {
    this.popupService.showModalConfirmDelete(() => {
      if (this.tabs[index].employeeWorkPlanningId) {
        this.empWorkPlanningService.deleteById(this.tabs[index].employeeWorkPlanningId).subscribe(res => {
          if (res.code === HTTP_STATUS_CODE.SUCCESS) {
            this.toast.success(
              this.translate.instant('common.notification.deleteSuccess')
            );
            this.patchValue();
          }
        });
      }
    });
  }

  onEdit(index: number) {
    this.title = this.translate.instant('kpi.employeeEvaluations.label.workPlanEdit');
    this.isVisible = true;
    this.valueInput = this.tabs[index].name;
    this.employeeWorkPlanning = this.tabs[index];
  }

  openInput() {
    this.employeeWorkPlanning = null;
    this.title = this.translate.instant('kpi.employeeEvaluations.label.workPlanAdd');
    this.isVisible = true;
  }

  onSave($event) {
    if ($event) {
      this.patchValue();
    }
  }

  override save(adjustReason?: string) {
    if (this.isValid()) {
      this.body.employeeEvaluationId = this.route.snapshot.queryParams.employeeEvaluationId;
      this.body.adjustReason = adjustReason;
      this.service.createOrImport(CommonUtils.convertDataSendToServer(this.body), REQUEST_TYPE.FORM_DATA, this.isEvaluateManage ? UrlConstant.EMPLOYEE_EVALUATION.EVALUATE_MANAGE : UrlConstant.EMPLOYEE_EVALUATION.EVALUATE)
        .subscribe(
          (res: BaseResponse<any>) => {
            if (res.code === HTTP_STATUS_CODE.SUCCESS) {
              this.toast.success(
                this.translate.instant('common.notification.updateSuccess')
              );
              this.afterSave(res);
              if (!this.isPage) {
                this.modalRef?.close({ refresh: true });
              } else {
                this.back();
              }
            }
          }
        );
    }
  }

  isValid() {
    this.panels[0].instance.isSubmitted = true;
    if (this.panels[0].instance.form.invalid) {
      if (this.panels[0].instance.formArray.length == 0
        || (this.panels[0].instance.formArray.length == 1 && !this.panels[0].instance.formArray.at(0).get('indicatorConversionId').value)) {
        this.toast.error(this.translate.instant('kpi.error.requiredIndicator'));
      }
      // this.tabSet.setSelectedIndex(0);
      return false;
    }
    this.body = _.clone(this.panels[0].instance.form.value);
    this.body.managerTotalPoint = this.panels[0].instance.getTotalManagePoint();
    this.body.selfTotalPoint = this.panels[0].instance.getTotalSelfPoint();
    this.body.workPlanningList = [];
    let listData = [];
    for (let i = 1; i < this.panels.length; i++) {
      let panel = this.panels[i];
      listData.push(panel.instance);
    }
    for (const it of listData) {
      it.isSubmitted = true;
      if (it.form.invalid) {
        // this.tabSet.setSelectedIndex(this.empWorkPlans.toArray().indexOf(it) + 1);
        return false;
      }
      const data = _.clone(it.form.value);
      data.content = JSON.stringify(data.configColumns);
      delete data.configColumns;
      this.body.workPlanningList.push(data);
    }
    return true;
  }

  override back() {
    CommonUtils.setFormSearchToLocalStorageByName('evaluations-ees-form', true);
    super.back();
  }

}



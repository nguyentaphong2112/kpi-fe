import {
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  Renderer2,
  RendererStyleFlags2,
  TemplateRef,
  ViewChild
} from '@angular/core';
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
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  EmployeeWorkPlanningsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/employee-work-plannings.service';
import {
  EvaluationCriteriaComponent
} from '@app/modules/kpi/pages/kpi-provides/employee-evaluations/evaluation-criteria/evaluation-criteria.component';
import { NzTabSetComponent } from 'ng-zorro-antd/tabs';
import _ from 'lodash';
import { BaseResponse } from '@core/models/base-response';
import { firstValueFrom } from 'rxjs';
import {
  WorkPlanningTemplatesService
} from '@app/modules/kpi/data-access/services/kpi-templates/work-planning-templates.service';
import { FunctionCode } from '@shared/enums/enums-constant';
import { MbCollapseComponent } from '@shared/component/hbt-collapse/hbt-collapse.component';
import { ScrollSpyDirective } from '@shared/directive/scroll-spy.directive';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { EmployeesService } from '@app/modules/hrm/data-access/services/staff-info/employees.service';
import { DataService } from '@shared/services/data.service';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'pes-form',
  templateUrl: './ees-form.component.html',
  styleUrls: ['./ees-form.component.scss']
})
export class EesFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  serviceName = MICRO_SERVICE.KPI;
  urlLoadData = '/employee-evaluations';
  scope = Scopes.VIEW;
  employeeWorkPlanning: any;
  isVisible = false;
  isDuplicate = false;
  valueInput = '';
  valueInputAdjust = '';
  tabs = [];
  title = this.translate.instant('kpi.employeeEvaluations.label.workPlanAdd');
  isDetail = false;
  isAdjust = false;
  isEvaluate = false;
  isVisibleAdjust = false;
  isSubmittedModal = false;
  employeeEvaluationId = null;
  public panels: NzSafeAny[] = [];
  public scrollTabs: NzSafeAny = [];
  validateModel = null;
  empInfo = null;
  functionCode = Constant.FUNCTION_CODE.EMPLOYEE_EVALUATIONS;
  status = null;
  isConcurrent = null;
  employeeId = null;
  codeGV = 'GV';

  @ViewChild(NzTabSetComponent) tabSetComponent: NzTabSetComponent;

  @ViewChild('collapse') collapse!: MbCollapseComponent;
  // @ViewChild(NzTabSetComponent) tabSet: NzTabSetComponent;
  // @ViewChild(EvaluationCriteriaComponent) empEvaluationCriteria: EvaluationCriteriaComponent;
  // @ViewChildren(WorkPlanComponent) empWorkPlans: QueryList<WorkPlanComponent>;
  @ViewChild(ScrollSpyDirective) scrollSpy: ScrollSpyDirective;
  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;

  constructor(
    private readonly service: EmployeeEvaluationsService,
    private cdr: ChangeDetectorRef,
    private readonly empWorkPlanningService: EmployeeWorkPlanningsService,
    private readonly workPlanningTemplatesService: WorkPlanningTemplatesService,
    private employeeService: EmployeesService,
    private dataService: DataService,
    private renderer: Renderer2,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.key = 'employeeEvaluationId';
    this.isDetail = this.route.snapshot.queryParams.isDetail;
    this.isAdjust = this.route.snapshot.queryParams.isAdjust;
    this.isEvaluate = this.route.snapshot.queryParams.isEvaluate;
    this.employeeEvaluationId = this.route.snapshot.queryParams.employeeEvaluationId;
    this.status = this.route.snapshot.queryParams.status;
    this.employeeId = this.route.snapshot.queryParams.employeeId;
    this.isConcurrent = this.route.snapshot.queryParams.isConcurrent;
    this.findOneById = (id) => this.empWorkPlanningService.findOneById(id);
    this.createApi = (body: EmployeeEvaluationsModel) => this.empWorkPlanningService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.updateApi = (body: EmployeeEvaluationsModel) => this.empWorkPlanningService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.FORM_DATA);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'kpi_employee_evaluations',
      functionCode: null
    });
    this.getConfigAttributes();
  }

  async ngOnInit() {
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    super.ngOnInit();
    await this.getDataEmp();
    // await this.getValidate();
    // this.patchValue();
    this.getPanels();
  }

  initForm() {
    this.form = this.fb.group({
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  // async getValidate() {
  //   try {
  //     const res = await firstValueFrom(this.service.findOneById(this.employeeEvaluationId, '/get-validate'));
  //     if (res.code === HTTP_STATUS_CODE.SUCCESS) {
  //       this.validateModel = res.data;
  //       this.data = this.validateModel;
  //       this.afterPatchValue();
  //     }
  //   } catch (error) {
  //     console.error('Error while validating:', error);
  //   }
  // }

  async getDataEmp() {
    try {
      const res = await firstValueFrom(this.service.findOneById(this.employeeId, '/get-data-emp'));
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.empInfo = res.data;
        if (this.empInfo == 105) {
          this.codeGV = 'GVTTGDTCTT';
        }
      }
    } catch (error) {
      console.error('Error while getDataEmp:', error);
    }
  }

  export() {
    this.employeeService.export({}, UrlConstant.EMPLOYEES.EXPORT + '/' + this.employeeId, false).toPromise();
  }

  updateApprove(type: string) {
    this.service.createOrImport({ ids: [this.employeeEvaluationId] }, REQUEST_TYPE.DEFAULT, UrlConstant.EMPLOYEE_EVALUATION.APPROVE + type).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.back();
      }
    });
  }

  getPanels() {
    const panels: any[] = [{
      id: 'evaluation_criteria',
      active: true,
      disabled: false,
      icon: null,
      code: FunctionCode.EVALUATION_CRITERIA,
      name: '',
      panelComponent: EvaluationCriteriaComponent,
      orderNumber: 0,
      dataValid: { adjust: this.validateModel?.adjust },
      extraMode: [
        {
          type: 'ADD'
        }
      ]
    }];
    this.scrollTabs = [{
      title: 'kpi.kpiEvaluations.organizations.label.evaluationCriteria',
      code: FunctionCode.EVALUATION_CRITERIA,
      scrollTo: 'evaluation_criteria'
    }];
    // for (let index = 0; index < this.tabs.length; index++) {
    //   const it = this.tabs[index];
    //   if ((it.name.includes(this.translate.instant('kpi.employeeEvaluations.label.administrativeJob')) && this.percentHC != 0)
    //     || (it.name.includes(this.translate.instant('kpi.employeeEvaluations.label.teacherJob')) && this.percentGV != 0)) {
    //     panels.push({
    //       id: 'work_plan' + index,
    //       active: true,
    //       disabled: false,
    //       icon: null,
    //       code: FunctionCode.WORK_PLAN + index,
    //       name: it.nameTab ?? it.name,
    //       panelComponent: WorkPlanComponent,
    //       data: { ...it, adjustKHCT: this.validateModel.adjustKHCT },
    //       orderNumber: index + 1,
    //       extraMode: [
    //         {
    //           type: 'EDIT_MODAL'
    //         }
    //       ]
    //     });
    //     this.scrollTabs.push({
    //       title: it.nameTab ?? it.name,
    //       code: FunctionCode.WORK_PLAN + index,
    //       scrollTo: 'work_plan' + index
    //     });
    //   }
    // }
    this.collapse.setPanels(panels);
    setTimeout(() => {
      this.panels = panels;
      for (let i = 0; i < this.panels.length; i++) {
        const panel = this.panels[i];
        this.collapse.setReference(panel.componentRef, panel.id);
      }
      this.cdr.detectChanges();
      this.scrollSpy.collectIds();
      this.scrollSpy.setLink(0);
    });
  }


  patchValue() {
    this.service.findOneById(this.route.snapshot.queryParams.employeeEvaluationId, UrlConstant.EMPLOYEE_EVALUATION.WORK_PLANNING).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        // this.service.findOneById(this.route.snapshot.queryParams.employeeEvaluationId, '/get-current-job').subscribe(resJob => {
        //   if (Object.keys(resJob.data).length !== 0) {
        //     let isTwoCase = resJob.data?.includes('GV') && resJob.data?.includes('HC');
        //     if (isTwoCase) {
        //       this.percentGV = this.extractPercent(resJob.data, 'GV');
        //       this.percentHC = this.extractPercent(resJob.data, 'HC');
        //       if (this.percentGV == 0 || this.percentHC == 0) {
        //         isTwoCase = false;
        //       }
        //     }
        if (res.data.listData.length > 0) {
          this.tabs = [...res.data.listData];
          if (this.tabs.length > 1) {
            this.tabs.forEach(it => {
              // if (it.name.toLowerCase().includes(this.translate.instant('kpi.employeeEvaluations.label.administrativeJob').toLowerCase())) {
              //   it.nameTab = it.name + (this.percentHC != null ? ' (' + this.percentHC + '%)' : '');
              // } else if (it.name.toLowerCase().includes(this.translate.instant('kpi.employeeEvaluations.label.teacherJob').toLowerCase())) {
              //   it.nameTab = it.name + (this.percentGV != null ? ' (' + this.percentGV + '%)' : '');
              // }
              it.nameTab = it.name + (it.percent != null ? ' (' + it.percent + '%)' : '');
            });
          }
        }
        this.getPanels();
        // else {
        //   this.workPlanningTemplatesService.getList({ listCode: [this.codeGV, 'HCV-14'] }, '/list').subscribe(resChild => {
        //     if (resChild.code === HTTP_STATUS_CODE.SUCCESS && resJob.code === HTTP_STATUS_CODE.SUCCESS) {
        //       if (isTwoCase) {
        //         this.tabs = [{
        //           name: this.translate.instant('kpi.employeeEvaluations.label.administrativeJob'),
        //           nameTab: this.translate.instant('kpi.employeeEvaluations.label.administrativeJob') + (this.percentHC != null ? ' (' + this.percentHC + '%)' : ''),
        //           content: resChild.data.find(it => it.code == 'HCV-14') ? resChild.data.find(it => it.code == 'HCV-14')?.content : null,
        //           orderNumber: 1,
        //           isDefault: true
        //         }, {
        //           name: this.translate.instant('kpi.employeeEvaluations.label.teacherJob'),
        //           nameTab: this.translate.instant('kpi.employeeEvaluations.label.teacherJob') + (this.percentGV != null ? ' (' + this.percentGV + '%)' : ''),
        //           orderNumber: 2,
        //           content: resChild.data.find(it => it.code == this.codeGV) ? resChild.data.find(it => it.code == this.codeGV)?.content : null,
        //           isDefault: true
        //         }];
        //       } else if (resJob.data?.includes('GV') && this.percentGV != 0) {
        //         this.tabs.push({
        //           name: this.translate.instant('kpi.employeeEvaluations.label.teacherJob'),
        //           orderNumber: 2,
        //           content: resChild.data.find(it => it.code == this.codeGV) ? resChild.data.find(it => it.code == this.codeGV)?.content : null,
        //           isDefault: true
        //         });
        //       } else if (resJob.data?.includes('HC') && this.percentHC != 0) {
        //         this.tabs.push({
        //           name: this.translate.instant('kpi.employeeEvaluations.label.administrativeJob'),
        //           content: resChild.data.find(it => it.code == 'HCV-14') ? resChild.data.find(it => it.code == 'HCV-14')?.content : null,
        //           orderNumber: 1,
        //           isDefault: true
        //         });
        //       }
        //       this.getPanels();
        //     }
        //   });
        // }
        //   }
        // });
      }
    });
  }

  extractPercent(input: string, target: string): number | null {
    const parts = input.split('-');
    for (const part of parts) {
      const [jobType, percent] = part.split('_');
      if (jobType === target) {
        return Number(percent);
      }
    }
    return null;
  }


  handleCancel(): void {
    this.isVisible = false;
    this.valueInput = '';
    this.isSubmitted = false;
    this.isDuplicate = false;
  }

  handleOk(): void {
    this.isSubmittedModal = true;
    this.isDuplicate = false;
    if (this.tabs.find(it => it.name == this.valueInput.trim()) && this.valueInput.trim() != this.employeeWorkPlanning?.name) {
      this.isDuplicate = true;
    }
    if (this.valueInput.trim() && !this.isDuplicate) {
      if (this.employeeWorkPlanning) {
        this.employeeWorkPlanning.name = this.valueInput;
        this.employeeWorkPlanning.employeeEvaluationId = this.employeeEvaluationId;
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
        let listData = [];
        this.employeeWorkPlanning = {};
        this.employeeWorkPlanning.name = this.valueInput;
        this.employeeWorkPlanning.employeeEvaluationId = this.employeeEvaluationId;
        this.employeeWorkPlanning.orderNumber = this.tabs.length + 1;
        listData.push(this.employeeWorkPlanning);
        if (!this.tabs[0].employeeWorkPlanningId) {
          const data = [{
            'name': this.translate.instant('kpi.employeeEvaluations.label.administrativeJob'),
            'employeeEvaluationId': this.employeeEvaluationId,
            'orderNumber': 1
          }, {
            'name': this.translate.instant('kpi.employeeEvaluations.label.teacherJob'),
            'employeeEvaluationId': this.employeeEvaluationId,
            'orderNumber': 2
          }];
          listData.push(...data);
        }
        this.empWorkPlanningService.createOrImport({ listData }, REQUEST_TYPE.FORM_DATA, '/list').subscribe(res => {
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
    this.isSubmittedModal = false;
    this.isVisible = true;
    this.valueInput = this.tabs[index].name;
    this.employeeWorkPlanning = this.tabs[index];
  }

  openInput() {
    this.employeeWorkPlanning = null;
    this.title = this.translate.instant('kpi.employeeEvaluations.label.workPlanAdd');
    this.valueInput = '';
    this.isSubmittedModal = false;
    this.isVisible = true;
  }

  onSave($event) {
    if ($event) {
      this.patchValue();
    }
  }

  override save(adjustReason?: string) {
    if (this.isValid() && this.form.valid) {
      this.body[this.keyAttributeData] = this.form.controls[this.keyAttributeData].value;
      this.body.employeeEvaluationId = this.route.snapshot.queryParams.employeeEvaluationId;
      this.body.adjustReason = adjustReason;
      this.service.createOrImport(CommonUtils.convertDataSendToServer(this.body), REQUEST_TYPE.FORM_DATA)
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
    return true;
  }

  openModal() {
    if (this.isValid()) {
      this.valueInputAdjust = this.panels[0].instance.adjustReason ?? '';
      this.isVisibleAdjust = true;
      this.isSubmittedModal = false;
    }
  }

  handleCancelAdjust(): void {
    this.isVisibleAdjust = false;
    this.isSubmittedModal = false;
  }

  handleOkAdjust(): void {
    this.isSubmittedModal = true;
    if (this.valueInputAdjust) {
      this.save(this.valueInputAdjust);
    }
  }

  override back() {
    CommonUtils.setFormSearchToLocalStorageByName('provides-ees-form', true);
    super.back();
  }

  protected readonly constant = Constant;
}



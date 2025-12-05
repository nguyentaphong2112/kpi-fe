import {
  AfterViewInit, ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  OrganizationEvaluationsModel
} from '../../../../data-access/models/kpi-evaluations/organization-evaluations.model';
import {
  OrganizationEvaluationsService
} from '../../../../data-access/services/kpi-evaluations/organization-evaluations.service';
import { BaseFormComponent } from '@core/components/base-form.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { Scopes } from '@core/utils/common-constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { Validators } from '@angular/forms';
import { BaseResponse } from '@core/models/base-response';
import { NzTabSetComponent } from 'ng-zorro-antd/tabs';
import _ from 'lodash';
import {
  EvaluationCriteriaComponent
} from '@app/modules/kpi/pages/kpi-evaluations/organization-evaluations/evaluation-criteria/evaluation-criteria.component';
import {
  WorkPlanComponent
} from '@app/modules/kpi/pages/kpi-evaluations/organization-evaluations/work-plan/work-plan.component';
import { firstValueFrom, take } from 'rxjs';
import { FunctionCode } from '@shared/enums/enums-constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ScrollSpyDirective } from '@shared/directive/scroll-spy.directive';
import { MbCollapseComponent } from '@shared/component/hbt-collapse/hbt-collapse.component';
import {
  EmployeeEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/employee-evaluations.service';

@Component({
  selector: 'oes-form',
  templateUrl: './oes-form.component.html',
  styleUrls: ['./oes-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OesFormComponent extends BaseFormComponent<OrganizationEvaluationsModel> implements OnInit {

  serviceName = MICRO_SERVICE.KPI;
  urlLoadData = '/organization-evaluations';
  scope = Scopes.VIEW;
  isDetail = false;
  isEvaluate = false;
  isEvaluateManage = false;
  isEvaluateDetail = false;
  public panels: NzSafeAny[] = [];
  public scrollTabs: NzSafeAny = [];
  userInfo = null;
  // @ViewChild(NzTabSetComponent) tabSet: NzTabSetComponent;
  // @ViewChild(EvaluationCriteriaComponent) empEvaluationCriteria: EvaluationCriteriaComponent;
  // @ViewChildren(WorkPlanComponent) empWorkPlans: QueryList<WorkPlanComponent>;
  @ViewChild(ScrollSpyDirective) scrollSpy: ScrollSpyDirective;
  @ViewChild('collapse') collapse!: MbCollapseComponent;

  constructor(
    private readonly service: OrganizationEvaluationsService,
    private readonly empService: EmployeeEvaluationsService,
    private cdr: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.isDetail = this.route.snapshot.queryParams.isDetail;
    this.isEvaluate = this.route.snapshot.queryParams.isEvaluate;
    this.isEvaluateManage = this.route.snapshot.queryParams.isEvaluateManage;
    this.isEvaluateDetail = this.route.snapshot.queryParams.isEvaluateDetail;
    this.key = 'organizationEvaluationId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: OrganizationEvaluationsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: OrganizationEvaluationsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, UrlConstant.ORGANIZATION_EVALUATION.EMP_MANAGER);
  }

  async ngOnInit() {
    this.initForm();
    // await this.getDataEmp();
    this.id = this.route.snapshot.queryParams.organizationEvaluationId;
    await this.getData();
    setTimeout(() => {
      this.getPanels();
      this.ref.detectChanges();
    });
  }

  override initForm() {
    this.form = this.fb.group({
      organizationId: [this.route.snapshot.queryParams.organizationId],
      empManagerId: [null, [Validators.required]],
      empManagerName: [null],
      orgName: [null],
      orgLevelManage: [null]
    });
  }


  // async getDataEmp() {
  //   try {
  //     const resUser = await firstValueFrom(this.empService.getData(null, '/get-data-user'));
  //     if (resUser.code === HTTP_STATUS_CODE.SUCCESS) {
  //       this.userInfo = resUser.data;
  //     }
  //   } catch (error) {
  //     console.error('Error while validating:', error);
  //   }
  // }

  getPanels() {
    const panels: any[] = [{
      id: 'evaluation_criteria',
      active: true,
      disabled: false,
      icon: null,
      code: FunctionCode.EVALUATION_CRITERIA,
      name: '',
      dataValid: { orgLevelManage: this.form.controls['orgLevelManage'].value },
      panelComponent: EvaluationCriteriaComponent
    }];
    this.scrollTabs = [{
      title: 'kpi.kpiEvaluations.organizations.label.evaluationCriteria',
      code: FunctionCode.EVALUATION_CRITERIA,
      scrollTo: 'evaluation_criteria'
    }];
    this.collapse.setPanels(panels);
    setTimeout(() => {
      this.panels = panels;
      this.panels.forEach(panel => {
        this.collapse.setReference(panel.componentRef, panel.id);
      });
      this.cdr.detectChanges();
      this.scrollSpy.collectIds();
      this.scrollSpy.setLink(0);
      this.ref.detectChanges();
    });
  }

  async getData() {
    try {
      const res = await firstValueFrom(this.findOneById(this.id));
      this.data = this.isConvertFindForm ? CommonUtils.convertDataFindForm(res.data) : res.data;
      this.afterInitData();
      this.patchValueInfo();
      this.ref.detectChanges();
    } catch (error) {
      console.error('Error while validating:', error);
    }
  }

  override save(adjustReason?: string) {
    if (this.isValid()) {
      this.body.organizationEvaluationId = this.route.snapshot.queryParams.organizationEvaluationId;
      this.body.adjustReason = adjustReason;
      this.service.createOrImport(CommonUtils.convertDataSendToServer(this.body), REQUEST_TYPE.FORM_DATA, this.isEvaluateManage ? UrlConstant.ORGANIZATION_EVALUATION.EVALUATE_MANAGE : UrlConstant.ORGANIZATION_EVALUATION.EVALUATE)
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
    this.isSubmitted = true;
    this.panels[0].instance.isSubmitted = true;
    if (this.form.invalid) {
      return false;
    }
    console.log(this.panels[0].instance.form);
    if (this.panels[0].instance.form.invalid) {
      if (this.panels[0].instance.formArray.length == 0
        || (this.panels[0].instance.formArray.length == 1 && !this.panels[0].instance.formArray.at(0).get('indicatorConversionId').value)) {
        this.toast.error(this.translate.instant('kpi.error.requiredIndicator'));
      }
      // this.tabSet.setSelectedIndex(0);
      return false;
    }
    this.body = _.clone(this.panels[0].instance.form.value);
    this.body.organizationIndicatorList = this.body.organizationIndicatorList.filter(it => it.indicatorId != null);
    this.body.managerTotalPoint = this.panels[0].instance.getTotalManagePoint();
    this.body.selfTotalPoint = this.panels[0].instance.getTotalSelfPoint();
    this.body.empManagerId = this.f['empManagerId'].value;
    if (this.panels[0].instance.listTarget.length > 0) {
      this.body.organizationIndicatorList.forEach((column: any) => {
        // column.target = JSON.stringify(column.target);
        column.target = {};
        this.panels[0].instance.listTarget.forEach((item: any) => {
          column.target[item.code] = column[item.code];
        });
      });
    }
    return true;
  }

  override back() {
    CommonUtils.setFormSearchToLocalStorageByName('evaluations-oes-form', true);
    super.back();
  }
}



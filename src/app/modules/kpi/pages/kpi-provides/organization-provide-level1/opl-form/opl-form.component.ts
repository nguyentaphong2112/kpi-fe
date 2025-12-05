import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  Renderer2,
  RendererStyleFlags2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import {
  OrganizationEvaluationsModel
} from '@app/modules/kpi/data-access/models/kpi-evaluations/organization-evaluations.model';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { Scopes } from '@core/utils/common-constants';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { NzTabSetComponent } from 'ng-zorro-antd/tabs';
import { ScrollSpyDirective } from '@shared/directive/scroll-spy.directive';
import { MbCollapseComponent } from '@shared/component/hbt-collapse/hbt-collapse.component';
import {
  OrganizationEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/organization-evaluations.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { firstValueFrom } from 'rxjs';
import { FunctionCode } from '@shared/enums/enums-constant';
import { BaseResponse } from '@core/models/base-response';
import _ from 'lodash';
import {
  EvaluationCriteriaComponent
} from '@app/modules/kpi/pages/kpi-provides/organization-provide-level1/evaluation-criteria/evaluation-criteria.component';

@Component({
  selector: 'app-opl-form',
  templateUrl: './opl-form.component.html',
  styleUrls: ['./opl-form.component.scss']
})
export class OplFormComponent extends BaseFormComponent<OrganizationEvaluationsModel> implements OnInit, AfterViewInit {

  serviceName = MICRO_SERVICE.KPI;
  urlLoadData = '/organization-evaluations';
  scope = Scopes.VIEW;
  isDetail = false;
  pathLevel = 0;
  valueInputAdjust = '';
  isAdjust = false;
  isEvaluate = false;
  isVisibleAdjust = false;
  isSubmittedModal = false;
  public panels: NzSafeAny[] = [];
  public scrollTabs: NzSafeAny = [];
  validateModel = null;
  status = null;
  organizationEvaluationId = null;
  functionCode = Constant.FUNCTION_CODE.ORGANIZATION_EVALUATION;
  dataSelect = [];
  isShowOrgParent = false;
  @ViewChild(NzTabSetComponent) tabSetComponent: NzTabSetComponent;
  // @ViewChild(NzTabSetComponent) tabSet: NzTabSetComponent;
  // @ViewChild(EvaluationCriteriaComponent) empEvaluationCriteria: EvaluationCriteriaComponent;
  // @ViewChildren(WorkPlanComponent) empWorkPlans: QueryList<WorkPlanComponent>;
  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;
  @ViewChild(ScrollSpyDirective) scrollSpy: ScrollSpyDirective;
  @ViewChild('collapse') collapse!: MbCollapseComponent;

  constructor(
    private readonly service: OrganizationEvaluationsService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    injector: Injector
  ) {
    super(injector);
    this.isPage = true;
    this.isDetail = this.route.snapshot.queryParams.isDetail;
    this.pathLevel = this.route.snapshot.queryParams.pathLevel;
    this.isAdjust = this.route.snapshot.queryParams.isAdjust;
    this.status = this.route.snapshot.queryParams.status;
    this.organizationEvaluationId = this.route.snapshot.queryParams.organizationEvaluationId;
    this.key = 'organizationEvaluationId';
    this.findOneById = (id) => this.service.findOneById(id);
    this.createApi = (body: OrganizationEvaluationsModel) => this.service.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: OrganizationEvaluationsModel) => this.service.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT, UrlConstant.ORGANIZATION_EVALUATION.EMP_MANAGER);
  }

  ngOnInit() {
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    super.ngOnInit();
    this.id = this.route.snapshot.queryParams.organizationEvaluationId;
    this.getData();
  }

  updateApprove(type: string) {
    this.service.createOrImport({ ids: [this.organizationEvaluationId] }, REQUEST_TYPE.DEFAULT, UrlConstant.ORGANIZATION_EVALUATION.APPROVE + type).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.back();
      }
    });
  }

  async getValidate() {
    try {
      const res = await firstValueFrom(this.service.findOneById(this.id, '/get-validate'));
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.validateModel = res.data;
      }
    } catch (error) {
      console.error('Error while validating:', error);
    }
  }

  async ngAfterViewInit() {
    await this.getValidate();
    this.getPanels();
    this.ref.detectChanges();
  }

  getPanels() {
    const panels: any[] = [{
      id: 'evaluation_criteria',
      active: true,
      disabled: false,
      icon: null,
      code: FunctionCode.EVALUATION_CRITERIA,
      name: '',
      dataValid: { adjust: this.validateModel.adjust },
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

  getData() {
    this.findOneById(this.id)
      .subscribe(
        (res: BaseResponse<any>) => {
          this.data = CommonUtils.convertDataFindForm(res.data);
          this.afterInitData();
          this.patchValueInfo();
          this.dataSelect = _.clone([{
            label: this.form.get('empManagerName')?.value,
            employeeId: this.form.get('empManagerId')?.value
          }]);
          this.ref.detectChanges();
        }
      );
  }

  override initForm() {
    this.form = this.fb.group({
      organizationId: [this.route.snapshot.queryParams.organizationId],
      empManagerId: [null],
      empManagerName: [null],
      orgName: [null]
    });
  }

  showOrgParent() {
    this.tabSetComponent.setSelectedIndex(1);
    this.isShowOrgParent = true;
    this.renderer.setStyle(document.getElementsByClassName('ant-tabs-nav')[0], 'display', 'flex', RendererStyleFlags2.Important);
  }

  override save(adjustReason?: string) {
    if (this.isValid()) {
      this.body.organizationEvaluationId = this.route.snapshot.queryParams.organizationEvaluationId;
      this.body.adjustReason = adjustReason;
      this.service.createOrImport(CommonUtils.convertDataSendToServer(this.body), REQUEST_TYPE.FORM_DATA, '/level1')
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
    this.body.empManagerId = this.f['empManagerId'].value;
    if (this.panels[0].instance.listTarget.length > 0) {
      this.body.organizationIndicatorList.forEach((column: any) => {
        column.target = {};
        this.panels[0].instance.listTarget.forEach((item: any) => {
          column.target[item.code] = column[item.code];
        });
      });
    }
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
    CommonUtils.setFormSearchToLocalStorageByName('provides-oes-form', true);
    super.back();
  }

}

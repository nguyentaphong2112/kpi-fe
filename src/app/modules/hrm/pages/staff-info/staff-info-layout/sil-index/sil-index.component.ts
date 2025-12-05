import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Scopes } from '@app/core/utils/common-constants';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@app/shared/enums/enums-constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PANELS_INFORMATION, SCROLL_TABS_DATA } from './sil-index.config';
import { MbCollapseComponent } from '@shared/component/hbt-collapse/hbt-collapse.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '@app/core/services/session.service';
import { StorageService } from '@app/core/services/storage.service';
import { STORAGE_NAME } from '@app/core/constant/system.constants';
import { ShareDataService } from '@shared/services/share-data.service';
import { PersonalInfo } from '@app/modules/hrm/data-access/models/personal-info';
import { PanelOption } from '@app/shared/component/hbt-collapse/panel.config';
import { Mode } from '@app/shared/constant/common';
import { _variable } from '@core/global-style/_variable';
import { EmployeesInfo } from '@app/modules/hrm/data-access/models/employee-info';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { PersonalInfoService } from '@app/modules/hrm/data-access/services/staff-info/personal-info.service';
import { BaseResponse } from '@core/models/base-response';
import { AlertModalChangeService } from '@app/modules/hrm/data-access/services/staff-info/alert-modal-change.service';

@Component({
  selector: 'app-staf-info-layout',
  templateUrl: './sil-index.component.html',
  styleUrls: ['./sil-index.component.scss']
})
export class SilIndexComponent implements OnInit, OnDestroy {
  public _variable = _variable;
  public panels = PANELS_INFORMATION;
  public scrollTabs: NzSafeAny = SCROLL_TABS_DATA;
  formSearch: FormGroup;
  modal?: NzModalRef;
  employeeId: number | NzSafeAny;
  employeeCode: string | NzSafeAny;
  scope: string = Scopes.VIEW;
  functionCode: string = FunctionCode.HR_PERSONAL_INFO;
  // pageName: string;
  option: NzSafeAny;
  constant = Constant;
  addWidth = 0;
  subs: Subscription[] = [];
  response: BaseResponse<any> = new BaseResponse();
  employeesInfo: EmployeesInfo | NzSafeAny;
  items: EmployeesInfo | NzSafeAny;
  private closeStaffInfoSubscription: Subscription;
  pageName: string;

  @ViewChild('collapse') collapse!: MbCollapseComponent;
  @ViewChild('footerTmpl') footerTmpl!: TemplateRef<Record<string, never>>;
  @ViewChild('footerTmpl', { static: true }) footerTpl!: TemplateRef<any>;

  constructor(
    private modalService: NzModalService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    protected translate: TranslateService,
    private fb: FormBuilder,
    private sessionService: SessionService,
    private shareService: ShareDataService,
    private router: ActivatedRoute,
    private shareDataService: ShareDataService,
    private alertModalChangeService: AlertModalChangeService,
    private personalInfoService: PersonalInfoService
  ) {
    const userLogin = StorageService.get(STORAGE_NAME.USER_LOGIN);
    // this.pageName = this.translate.instant(this.activatedRoute.snapshot.data['pageName']);
    this.activatedRoute.queryParams.subscribe((params) => {
      this.employeeId = params.employeeId ?? userLogin.employeeId ?? 1;
    });
    this.formSearch = this.fb.group({
      formStaff: null,
      employeeCode: null
    });
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.employeeId = params.employeeId;
      this.shareService.changeEmployee({ employeeId: this.employeeId });
      this.getPersonalInfo();
    });
    this.onListener();
  }

  getPersonalInfo() {
    this.subs.push(
      this.personalInfoService.getById(this.employeeId).subscribe((res: any) => {
        this.response = res;
        this.employeesInfo = new EmployeesInfo.PersonalInfo(this.response?.data);
        this.items = this.response?.data;
        this.shareDataService.changePersonalInfo(this.response?.data);
        const perInfo = this.employeesInfo.getInfoByType('BASIC_INFO');
        const familyRelationShipInfo = this.employeesInfo.getInfoByType('FAMILY_INFO');
        const workInfo = this.employeesInfo.getInfoByType('WORK_INFO');
        const eduInfo = this.employeesInfo.getInfoByType('EDU_INFO');
        const awardInfo = this.employeesInfo.getInfoByType('AWARD_INFO');
        const polInfo = this.employeesInfo.getInfoByType('POLITICAL_INFO');
        this.panels.forEach((panel: NzSafeAny) => {
          panel.data = panel.data ?? {};
          panel.data.personalInfo = perInfo?.details;
          panel.data.workInfo = workInfo?.details;
          panel.data.eduInfo = eduInfo?.details;
          panel.data.familyRelationShipInfo = familyRelationShipInfo?.details;
          panel.data.awardInfo = awardInfo?.details;
          panel.data.policyInfo = polInfo?.details;
          this.collapse.setReference(panel.componentRef, panel.id);
        });
      })
    );
  }

  openEditModal(panel: PanelOption | NzSafeAny, type: string) {
    const extraOption = panel.extraMode?.find((item: NzSafeAny) => item.type === type);
    const instance = this.collapse.getInstance(panel);
    let mode = -1;
    if (type === this.constant.ACTION_PANEL.VIEW) {
      mode = Mode.VIEW;
    } else if (type === this.constant.ACTION_PANEL.EDIT) {
      mode = Mode.EDIT;
    }
    this.modal = this.modalService.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: this.translate.instant(extraOption.contentHeader),
      nzContent: extraOption.content,
      nzComponentParams: {
        mode,
        data: instance
      },
      nzFooter: this.footerTmpl
    });

    this.modal.afterClose.subscribe(res => {
      if (res && res.refresh) {
        this.getPersonalInfo();
      }
    });
  }

  openAddModal(panel: PanelOption | any, type: string) {
    const extraOption = panel.extraMode?.find((mode: any) => mode.type === type);

    this.modal = this.modalService.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: this.translate.instant(extraOption.contentHeader),
      nzContent: extraOption.content,
      nzComponentParams: {
        mode: Mode.ADD
      },
      nzFooter: this.footerTmpl
    });
    this.modal.afterClose.subscribe(res => {
      if (res && res.refresh) {
        this.getPersonalInfo();
      }
    });
  }

  onSearchChange(panel: PanelOption, value: string) {
    const instance = this.collapse.getInstance(panel);
    instance.searchData(value);
  }

  checkShowAction(panel: PanelOption): NzSafeAny {
    return this.sessionService.getSessionData(`FUNCTION_${panel.code}`).edit;
  }

  cancel() {
    this.modal?.destroy();
  }

  save() {
    this.modal?.getContentComponent().save();
  }

  onEmpInfoReady(event: PersonalInfo) {
    this.option = {
      // pageName: this.pageName,
      empCode: event.employeeCode,
      empName: event.fullName
    };
  }

  private getNzWidth(): number {
    return window.innerWidth > 767 ? (window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5) : window.innerWidth;
  }


  onListener() {
    this.closeStaffInfoSubscription = this.alertModalChangeService.closeStaffInfo$.subscribe((res) => {
      if (res) {
        this.getPersonalInfo();
      }
    });
    this.router.snapshot.queryParams.employeeId.valueChanges?.pipe(distinctUntilChanged()).subscribe(employeeId => {
      this.employeeId = employeeId;
      this.shareService.changeEmployee({ employeeId: this.employeeId });
      this.getPersonalInfo();
    });
  }

  ngOnDestroy(): void {
    if (this.closeStaffInfoSubscription) {
      this.closeStaffInfoSubscription.unsubscribe();
    }
  }

}

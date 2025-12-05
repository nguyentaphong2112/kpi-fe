import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Scopes } from '@core/utils/common-constants';
import { Mode } from '@shared/constant/common';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { BaseListComponent } from '@core/components/base-list.component';
import { HbtTreeViewComponent } from '@shared/component/hbt-tree-view/hbt-tree-view.component';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { OrganizationsFormComponent } from '@app/modules/hrm/pages/model-plan/organizations/organizations-form/organizations-form.component';
import { PositionFormComponent } from '@app/modules/hrm/pages/model-plan/organizations/position-form/position-form.component';
import { PositionIndexComponent } from '@app/modules/hrm/pages/model-plan/organizations/position-index/position-index.component';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-organizations-layout',
  templateUrl: './organizations-layout.component.html',
  styleUrls: ['./organizations-layout.component.scss']
})
export class OrganizationsLayoutComponent extends BaseListComponent<any> implements OnInit, OnDestroy {
  urlLoadNodeOrg = UrlConstant.ORGANIZATIONS_TREE.LOAD_NODE;
  urlLoadChildren = UrlConstant.ORGANIZATIONS_TREE.LOAD_CHILDREN;
  serviceName = MICRO_SERVICE.HRM;
  orgInfoSelect: NzSafeAny = null;
  searchValue = '';
  functionCode = FunctionCode.HR_ORGANIZATIONS;
  scope = Scopes.VIEW;
  modeConst = Mode;
  indexTab = 0;
  defaultFormConfig: any;

  @ViewChild('orgTreeView') orgTreeView!: HbtTreeViewComponent;
  @ViewChild('positionIndex') positionIndex!: PositionIndexComponent;

  constructor(injector: Injector) {
    super(injector);
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.formConfig = {
      title: 'hrm.modelPlan.label.orgLower',
      content: OrganizationsFormComponent,
    };
    this.defaultFormConfig = this.formConfig;
  }

  ngOnInit() {
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
  }

  selectNode(data: NzSafeAny) {
    this.orgInfoSelect = data;
  }

  initRoodNode(data: NzSafeAny) {
    this.orgInfoSelect = {id: data[0]?.key, name: data[0]?.title};
  }

  override search() {
    if (this.indexTab === 1) {
      this.positionIndex.search(1);
    }
  }

  selectedIndexChange(index: number) {
    this.indexTab = index;
    if (index === 1) {
      this.functionCode = FunctionCode.HR_POSITIONS;
      this.formConfig = {
        title: 'hrm.modelPlan.label.positionInfo',
        content: PositionFormComponent,
      };
      this.key = 'positionId';
    } else {
      this.functionCode = FunctionCode.HR_ORGANIZATIONS;
      this.formConfig = this.defaultFormConfig;
      this.key = 'organizationId';
    }
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach(sub => sub.unsubscribe());
    this.modalRef?.destroy();
  }

}

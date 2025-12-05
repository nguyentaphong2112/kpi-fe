import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { PositionGroupsService } from '@app/modules/hrm/data-access/services/model-plan/position-groups.service';
import { PgsFormComponent } from '@app/modules/hrm/pages/model-plan/position-groups/pgs-form/pgs-form.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-pgs-index',
  templateUrl: './pgs-index.component.html',
  styleUrls: ['./pgs-index.component.scss']
})
export class PgsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = FunctionCode.HR_POSITION_GROUP;

  constructor(injector: Injector,
              private pgsService: PositionGroupsService) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.pgsService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.pgsService.getFilterResearch(body, pagination);
    this.key = 'positionGroupId';
    this.formConfig = {
      title: 'hrm.modelPlan.positionGroups.label.pgs',
      content: PgsFormComponent
    };
  }




  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null
    });
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
        })
      ]
    });
  }

  override setHeaders() {
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
        title: 'hrm.modelPlan.positionGroups.label.code',
        thClassList: ['text-center'],
        field: 'code'
      },
      {
        title: 'hrm.modelPlan.positionGroups.label.name',
        field: 'name',
        thClassList: ['text-center']
      },
      {
        title: 'hrm.modelPlan.positionGroups.label.groupType',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'groupTypeName',
        width: 300
      },
      {
        title: 'hrm.modelPlan.positionGroups.label.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'hrm.modelPlan.positionGroups.label.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'hrm.modelPlan.positionGroups.label.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'hrm.modelPlan.positionGroups.label.modifiedBy',
        field: 'modifiedBy',
        thClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }

}

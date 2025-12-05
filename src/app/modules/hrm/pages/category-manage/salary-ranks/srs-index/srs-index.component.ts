import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { SrsFormComponent } from '@app/modules/hrm/pages/category-manage/salary-ranks/srs-form/srs-form.component';
import { FunctionCode } from '@shared/enums/enums-constant';
import { SalaryRanksService } from '@app/modules/hrm/data-access/services/category-manage/salary-ranks.service';

@Component({
  selector: 'app-srs-index',
  templateUrl: './srs-index.component.html',
  styleUrls: ['./srs-index.component.scss']
})
export class SrsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = FunctionCode.HR_SALARY_RANKS;
  isShowAdvSearch = false;

  constructor(injector: Injector,
              private salaryRanksService: SalaryRanksService) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.salaryRanksService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.salaryRanksService.getFilterResearch(body, pagination);
    this.key = 'salaryRankId';
    this.formConfig = {
      title: 'hrm.staffManager.categoryManage.salaryRanks.label.salaryRank',
      content: SrsFormComponent
    };
  }



  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null,
      salaryType: null
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
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.name',
        field: 'name',
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.code',
        thClassList: ['text-center'],
        field: 'code'
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.salaryType',
        thClassList: ['text-center'],
        field: 'salaryTypeName'
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.startDate',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'startDate',
        width: 150
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.endDate',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'endDate',
        width: 150
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.orderNumber',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'orderNumber',
        width: 100
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'hrm.staffManager.categoryManage.salaryRanks.label.modifiedBy',
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

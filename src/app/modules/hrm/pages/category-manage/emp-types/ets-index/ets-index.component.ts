import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { EtsFormComponent } from '@app/modules/hrm/pages/category-manage/emp-types/ets-form/ets-form.component';
import { EmpTypeService } from '@app/modules/hrm/data-access/services/category-manage/emp-type.service';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-ets-index',
  templateUrl: './ets-index.component.html',
  styleUrls: ['./ets-index.component.scss']
})
export class EtsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = FunctionCode.HR_EMP_TYPES;

  constructor(injector: Injector,
              private empTypeService: EmpTypeService) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.empTypeService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.empTypeService.getFilterResearch(body, pagination);
    this.key = 'empTypeId';
    this.formConfig = {
      title: 'hrm.staffManager.categoryManage.empTypes.label.empType',
      content: EtsFormComponent
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
        title: 'hrm.staffManager.categoryManage.empTypes.label.name',
        field: 'name',
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.categoryManage.empTypes.label.code',
        thClassList: ['text-center'],
        field: 'code'
      },
      {
        title: 'hrm.staffManager.categoryManage.empTypes.label.orderNumber',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'orderNumber',
        width: 100
      },
      {
        title: 'hrm.staffManager.categoryManage.empTypes.label.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'hrm.staffManager.categoryManage.empTypes.label.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 100
      },
      {
        title: 'hrm.staffManager.categoryManage.empTypes.label.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'hrm.staffManager.categoryManage.empTypes.label.modifiedBy',
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

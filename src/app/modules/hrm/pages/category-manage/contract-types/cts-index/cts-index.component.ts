import { Component, HostListener, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CtsFormComponent } from '@app/modules/hrm/pages/category-manage/contract-types/cts-form/cts-form.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { ContractTypeService } from '@app/modules/hrm/data-access/services/category-manage/contract-type.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-cts-index',
  templateUrl: './cts-index.component.html',
  styleUrls: ['./cts-index.component.scss']
})
export class CtsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  serviceName = MICRO_SERVICE.HRM;
  urlLoadEmpTypeList = UrlConstant.EMP_TYPES.GET_LIST;
  functionCode = FunctionCode.HR_CONTRACT_TYPES;
  @ViewChild('empTmpl', { static: true }) empTpl!: TemplateRef<any>;
  isShowAdvSearch = false;

  constructor(injector: Injector,
              private contractTypeService: ContractTypeService) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.contractTypeService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.contractTypeService.getFilterResearch(body, pagination);
    this.key = 'contractTypeId';
    this.formConfig = {
      title: 'hrm.staffManager.categoryManage.contractTypes.label.contractType',
      content: CtsFormComponent
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
      empTypeId: null
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
        title: 'hrm.staffManager.categoryManage.contractTypes.label.name',
        field: 'name',
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.categoryManage.contractTypes.label.code',
        thClassList: ['text-center'],
        field: 'code'
      },
      {
        title: 'hrm.staffManager.categoryManage.contractTypes.label.empType',
        thClassList: ['text-center'],
        field: 'empTypeName'
      },
      {
        title: 'hrm.staffManager.categoryManage.contractTypes.label.classifyCode',
        thClassList: ['text-center'],
        field: 'classifyCode'
      },
      {
        title: 'hrm.staffManager.categoryManage.contractTypes.label.orderNumber',
        thClassList: ['text-center'],
        field: 'orderNumber'
      },
      {
        title: 'hrm.staffManager.categoryManage.contractTypes.label.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'hrm.staffManager.categoryManage.contractTypes.label.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 100
      },
      {
        title: 'hrm.staffManager.categoryManage.contractTypes.label.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'hrm.staffManager.categoryManage.contractTypes.label.modifiedBy',
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

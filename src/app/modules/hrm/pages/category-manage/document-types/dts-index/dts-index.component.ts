import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { DtsFormComponent } from '@app/modules/hrm/pages/category-manage/document-types/dts-form/dts-form.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { DocumentTypeService } from '@app/modules/hrm/data-access/services/category-manage/document-type.service';
import { ObjectUtil } from '@core/utils/object.util';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-dts-index',
  templateUrl: './dts-index.component.html',
  styleUrls: ['./dts-index.component.scss']
})
export class DtsIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  listTypeDocument: CategoryModel[] = [];
  constant = Constant;
  functionCode = FunctionCode.HR_DOCUMENT_TYPES;
  isShowAdvSearch = false;

  constructor(injector: Injector,
              private documentTypeService: DocumentTypeService) {
    super(injector);
    this.initFormSearch();
    this.initDataSelect();
    this.deleteApi = (id: number | string) => this.documentTypeService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.documentTypeService.getFilterResearch(body, pagination);
    this.key = 'documentTypeId';
    this.formConfig = {
      title: 'hrm.staffManager.categoryManage.documentTypes.label.documentType',
      content: DtsFormComponent
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
      type: null
    });
  }

  initDataSelect() {
    this.listTypeDocument = ObjectUtil.optionsToList(this.constant.DOCUMENT_TYPE, this.translate);
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
        title: 'hrm.staffManager.categoryManage.documentTypes.label.name',
        field: 'name',
        thClassList: ['text-center']
      },
      {
        title: 'hrm.staffManager.categoryManage.documentTypes.label.code',
        thClassList: ['text-center'],
        field: 'code'
      },
      {
        title: 'hrm.staffManager.categoryManage.documentTypes.label.type',
        thClassList: ['text-center'],
        field: 'type'
      },
      {
        title: 'hrm.staffManager.categoryManage.documentTypes.label.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'hrm.staffManager.categoryManage.documentTypes.label.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 100
      },
      {
        title: 'hrm.staffManager.categoryManage.documentTypes.label.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'hrm.staffManager.categoryManage.documentTypes.label.modifiedBy',
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

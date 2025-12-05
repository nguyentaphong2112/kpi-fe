import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { AttributeService } from '@app/modules/admin/data-access/services/configurations/attribute.service';
import {
  AttributeFormComponent
} from '@app/modules/admin/pages/configurations/attributes/attribute-form/attribute-form.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-attribute-index',
  templateUrl: './attribute-index.component.html',
  styleUrls: ['./attribute-index.component.scss']
})
export class AttributeIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = FunctionCode.SYS_CONFIG_ATTRIBUTE;

  constructor(injector: Injector,
              private readonly attributeService: AttributeService) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.attributeService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.attributeService.getFilterResearch(body, pagination);
    this.formConfig = {
      title: 'admin.configurations.attributes.label.attribute',
      content: AttributeFormComponent
    };
    this.key = 'configObjectAttributeId';
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
        title: 'admin.configurations.attributes.label.name',
        field: 'name',
        thClassList: ['text-center']
      },
      {
        title: 'admin.configurations.attributes.label.tableName',
        thClassList: ['text-center'],
        field: 'tableName'
      },
      {
        title: 'admin.configurations.attributes.label.functionCode',
        thClassList: ['text-center'],
        field: 'functionCode'
      },
      {
        title: 'admin.configurations.attributes.label.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'admin.configurations.attributes.label.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 100
      },
      {
        title: 'admin.configurations.attributes.label.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'admin.configurations.attributes.label.modifiedBy',
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

import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { Subscription } from 'rxjs';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { CommonUtils } from '@shared/services/common-utils.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { FunctionCode } from '@shared/enums/enums-constant';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { CardTemplatesModel } from '@app/modules/admin/data-access/models/card-templates/card-templates.model';
import { CardTemplatesService } from '@app/modules/admin/data-access/services/card-templates/card-templates.service';
import { CtsFormComponent } from '../cts-form/cts-form.component';

@Component({
  selector: 'app-cts-index',
  templateUrl: './cts-index.component.html',
  styleUrls: ['./cts-index.component.scss']
})
export class CtsIndexComponent extends BaseListComponent<CardTemplatesModel> implements OnInit {
  subs: Subscription[] = [];
  constant = Constant;
  titleConfig = '';
  isShowAdvSearch = false;

  constructor(
    injector: Injector,
    private readonly service: CardTemplatesService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.titleConfig = this.translate.instant('admin.cardTemplates.label');
    this.formConfig = {title: this.titleConfig, content: CtsFormComponent};
    this.key = 'cardTemplateId';
    this.serviceName = MICRO_SERVICE.ADMIN;
    this.addWidth = window.innerWidth > 1110 ? (window.innerWidth - 1110) / 3 : window.innerWidth / 4;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.SYS_CATEGORY_TYPE}`);
    this.initAction();
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunction?.edit,
          disabled: (evt: any) => {
            return !evt;
          },
          function: this.doOpenFormEdit,
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          disabled: (evt: any) => {
            return !evt;
          },
          function: this.deleteItem,
        })
      ]
    });
  }

  initFormSearch() {
    this.form = this.fb.group({
        templateType: null
      }
    );
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
        title: 'admin.cardTemplates.templateTypeName',
        thClassList: ['text-center'],
        field: 'templateTypeName',
        width: 200,
      },
      {
        title: 'admin.cardTemplates.title',
        thClassList: ['text-center'],
        field: 'title',
        width: 300,
      },
      {
        title: 'admin.cardTemplates.isApplyAll',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'isApplyAllName',
        width: 110,
      },
      {
        title: 'admin.common.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 120,
      },
      {
        title: 'admin.common.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
      },
      {
        title: 'admin.common.modifiedBy',
        field: 'modifiedBy',
        thClassList: ['text-center'],
        width: 120,
      },
      {
        title: 'admin.common.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
      },
      {
        title: '',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 60,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right',
      },
    ];
  }
}

import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { Subscription } from 'rxjs';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { CategoryTypeService } from '@app/modules/admin/data-access/services/categories/category-type.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { FunctionCode } from '@shared/enums/enums-constant';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { CategoryTypesModel } from '@app/modules/admin/data-access/models/categories/category-types.model';
import { CtsFormComponent } from '@app/modules/admin/pages/categories/category-types/cts-form/cts-form.component';

@Component({
  selector: 'app-cts-index',
  templateUrl: './cts-index.component.html',
  styleUrls: ['./cts-index.component.scss']
})
export class CtsIndexComponent extends BaseListComponent<CategoryTypesModel> implements OnInit {
  subs: Subscription[] = [];
  constant = Constant;
  titleConfig = '';
  isShowAdvSearch = false;

  constructor(
    injector: Injector,
    private readonly service: CategoryTypeService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.titleConfig = this.translate.instant('admin.categoryTypes.title');
    this.formConfig = {title: this.titleConfig, content: CtsFormComponent};
    this.key = 'categoryTypeId';
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
        keySearch: null,
        categoryType: null
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
        title: 'admin.common.code',
        thClassList: ['text-center'],
        field: 'code',
        width: 200,
      },
      {
        title: 'admin.common.name',
        thClassList: ['text-center'],
        field: 'name',
        width: 300,
      },
      {
        title: 'admin.common.isAutoIncrease',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        field: 'isAutoIncreaseName',
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
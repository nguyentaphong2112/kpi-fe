import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { Subscription } from 'rxjs';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CategoriesService } from '@app/modules/admin/data-access/services/categories/categories.service';
import { CategoryTypeService } from '@app/modules/admin/data-access/services/categories/category-type.service';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { CategoriesModel } from '@app/modules/admin/data-access/models/categories/categories.model';
import { CsmFormComponent } from '../csm-form/csm-form.component';
import { FunctionCode } from '@shared/enums/enums-constant';
import { CommonUtils } from '@shared/services/common-utils.service';
import { CtsFormComponent } from '@app/modules/admin/pages/categories/category-types/cts-form/cts-form.component';
import { Mode } from '@shared/constant/common';
import { CategoryTypesModel } from '@app/modules/admin/data-access/models/categories/category-types.model';
import { AppFunction } from '@core/models/app-function.interface';

@Component({
  selector: 'app-csm-index',
  templateUrl: './csm-index.component.html',
  styleUrls: ['./csm-index.component.scss']
})
export class CsmIndexComponent extends BaseListComponent<CategoriesModel> implements OnInit {
  subs: Subscription[] = [];
  constant = Constant;
  keySearchCategory: string;
  listCategoryType: any[] = [];
  listCategoryTypeDef: any[] = [];
  categoryTypeSelect: any;
  titleConfig = '';
  groupType = null;
  isMenu = false;
  objFunctionCategoryType: AppFunction;

  constructor(
    injector: Injector,
    private readonly service: CategoriesService,
    private categoryTypeService: CategoryTypeService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString(), `/${this.categoryTypeSelect?.code}`);
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination, `/${this.categoryTypeSelect?.code}`);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true), `/${this.categoryTypeSelect?.code}/export`);
    this.isCustomSearch = true;
    this.titleConfig = this.translate.instant('admin.categories.label.category');
    this.formConfig = {title: this.titleConfig, content: CsmFormComponent};
    this.key = 'categoryId';
    this.serviceName = MICRO_SERVICE.ADMIN;
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.queryParams.subscribe(params => {
      this.groupType = params['groupType'] ?? null;
      this.isMenu = params['isMenu']?.toUpperCase()?.includes('true'.toUpperCase());
      this.initDataSelect().then();
    })
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.SYS_CATEGORIES}`);
    this.objFunctionCategoryType = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.SYS_CATEGORY_TYPE}`);
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

  async initDataSelect(isRefresh = false) {
    const categoryTypeRes = await this.categoryTypeService.getList({groupType: this.groupType}, '/all').toPromise();
    if (categoryTypeRes.code === HTTP_STATUS_CODE.SUCCESS) {
      this.listCategoryType = categoryTypeRes.data;
      this.listCategoryTypeDef = categoryTypeRes.data;
      if (isRefresh) {
        this.changeKeySearch(this.keySearchCategory);
        this.categoryTypeSelect = this.listCategoryType.find(item => item.categoryTypeId === this.categoryTypeSelect?.categoryTypeId);
      } else {
        this.categoryTypeSelect = this.listCategoryType[0];
      }
      this.formConfig.title = this.titleConfig + `: ${this.categoryTypeSelect?.name}`;
      if (this.categoryTypeSelect) {
        this.search();
      }
    }
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
        width: 150,
      },
      {
        title: 'admin.common.name',
        thClassList: ['text-center'],
        field: 'name',
        width: 200,
      },
      {
        title: 'admin.common.value',
        thClassList: ['text-center'],
        field: 'value',
        width: 100,
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

  changeKeySearch(value: string) {
    this.listCategoryType = this.listCategoryTypeDef;
    if (value) {
      this.listCategoryType = this.listCategoryType.filter(item => item.name?.toLowerCase().indexOf(value.toLowerCase()) > -1);
    }
  }

  selectCategoryType(data: any) {
    this.categoryTypeSelect = data;
    this.formConfig.title = this.titleConfig + `: ${data.name}`;
    this.search();
  }

  doAddCategoryType(mode: Mode, data: CategoryTypesModel) {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() + (window.innerWidth > 1110 ? (window.innerWidth - 1110) / 3 : window.innerWidth / 4),
      nzTitle: this.translate.instant(mode === this.modeConst.ADD ? 'admin.categoryTypes.add' : 'admin.categoryTypes.edit'),
      nzContent: CtsFormComponent,
      nzMaskClosable: this.formConfig.isCloseModal,
      nzComponentParams: {
        mode,
        data,
        config: this.formConfig.config
      },
      nzFooter: this.footerTpl
    });
    this.modalRef.afterClose.subscribe((result) => {
      if (result?.refresh) {
        this.initDataSelect(true).then();
      }
    });
  }
}

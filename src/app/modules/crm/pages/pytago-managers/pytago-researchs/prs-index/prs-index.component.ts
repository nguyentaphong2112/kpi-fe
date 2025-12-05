import { Component, Injector, OnInit } from '@angular/core';
import { PytagoResearchsModel } from '../../../../data-access/models/pytago-managers/pytago-researchs.model';
import { PytagoResearchsService } from '../../../../data-access/services/pytago-managers/pytago-researchs.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Constant } from '@app/modules/crm/data-access/constants/constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { ObjectUtil } from '@core/utils/object.util';
import { Utils } from '@core/utils/utils';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { PtoIndexComponent } from '@app/modules/crm/pages/pytago-managers/pytago/pto-index/pto-index.component';
import { ShudService } from '@app/modules/crm/data-access/services/pytago-managers/shud.service';
import { AuthService } from '@shared/services/auth.service';
import { REQUEST_TYPE } from '@app/shared/constant/common';
import { UrlConstant } from '@app/shared/constant/url.class';
import { HTTP_STATUS_CODE } from '@app/core/constant/system.constants';

@Component({
  selector: 'app-prs-index',
  templateUrl: './prs-index.component.html',
  styleUrls: ['./prs-index.component.scss']
})


export class PrsIndexComponent extends BaseListComponent<PytagoResearchsModel> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.CRM_PYTAGO_RESEARCHS;
  isShowAdvSearch = false;
  typeList: CategoryModel[] = [];

  ptoIndexComponent: PtoIndexComponent;


  constructor(
    injector: Injector,
    private readonly service: PytagoResearchsService,
    private shudService: ShudService,
    private pytagoResearchsService: PytagoResearchsService,
    private authService: AuthService
  ) {
    super(injector);
    this.initFormSearch();
    this.initDataSelect();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.key = 'pytagoResearchId';
    this.ptoIndexComponent = new PtoIndexComponent(shudService, pytagoResearchsService, authService, injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.printBook',
          icon: 'printer',
          isShow: this.objFunction?.view,
          function: async (evt) => {
            return await this.printBook(evt);
          }
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          function: this.deleteItem
        }),
        new ChildActionSchema({
          label: 'crm.pytagoResearchs.button.createCustomer',
          icon: 'plus',
          isShow: this.objFunction?.create,
          function: (evt: any) => {
            this.createCustomer( evt.pytagoResearchId);
          }
        })
      ]
    });
  }
  createCustomer( id: number) {
      this.service.createOrImport({
      }, REQUEST_TYPE.DEFAULT, UrlConstant.PYTAGO_RESEARCH.CREATE_CUSTOMER + id).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.toast.success(this.translate.instant('common.notification.updateSuccess'));
          this.search();
        }
      });
    }

  beforeSearch() {
    this.params.dateOfBirth = Utils.convertDateToSendServer(this.params.dateOfBirth);
  }

  initDataSelect() {
    this.typeList = ObjectUtil.optionsToList(Constant.TYPE_LIST, this.translate);
  }

  async printBook(data: any) {
    const userData = {
      person_type: data.type ?? null,
      name: data.fullName ?? null,
      birthday: Utils.convertDateToFillForm(data.dateOfBirth) ?? null,
      parent_name: data.parentName ?? null,
      mobile: data.mobileNumber ?? null,
      email: data.email ?? null,
      address: data.currentAddress ?? null
    };
    await this.ptoIndexComponent.onFinish(userData);
    if (!this.ptoIndexComponent.disableExport) {
      this.ptoIndexComponent.printBook();
    } else {
      this.toast.error(
        this.translate.instant('crm.notification.printError')
      );
    }
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null,
      dateOfBirth: null,
      parentName: null,
      mobileNumber: null,
      email: null,
      currentAddress: null,
      type: null
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
        width: 70
      },
      {
        title: 'crm.pytagoResearchs.table.fullName',
        field: 'fullName',
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.pytagoResearchs.table.dateOfBirth',
        field: 'dateOfBirth',
        thClassList: ['text-center']
      },
      {
        title: 'crm.pytagoResearchs.table.parentName',
        field: 'parentName',
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.pytagoResearchs.table.mobileNumber',
        field: 'mobileNumber',
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.pytagoResearchs.table.email',
        field: 'email',
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.pytagoResearchs.table.currentAddress',
        field: 'currentAddress',
        thClassList: ['text-center'],
        thFilter: true,
        filterType: 'text'
      },
      {
        title: 'crm.pytagoResearchs.table.type',
        field: 'type',
        thClassList: ['text-center']
      },
      {
        title: 'crm.pytagoResearchs.table.isCustomer',
        field: 'isCustomer',
        thClassList: ['text-center'],
        show: false
      },
      {
        title: 'crm.pytagoResearchs.table.createdBy',
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'crm.pytagoResearchs.table.createdTime',
        field: 'createdTime',
        width: 150,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.pytagoResearchs.table.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'crm.pytagoResearchs.table.modifiedTime',
        field: 'modifiedTime',
        width: 150,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.pytagoResearchs.table.lastUpdateTime',
        field: 'lastUpdateTime',
        width: 150,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }
}


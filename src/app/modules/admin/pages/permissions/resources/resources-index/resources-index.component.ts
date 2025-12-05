import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Subscription } from 'rxjs';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/admin/data-access/constants/constant';
import { ResourcesService } from '@app/modules/admin/data-access/services/permissions/resources.service';
import { UrlConstant } from '@app/modules/admin/data-access/constants/url.constant';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { ResourcesFormComponent } from '../resources-form/resources-form.component';
import { FunctionCode } from '@shared/enums/enums-constant';

@Component({
  selector: 'app-resources-index',
  templateUrl: './resources-index.component.html',
  styleUrls: ['./resources-index.component.scss']
})
export class ResourcesIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  subs: Subscription[] = [];
  listStatus: CategoryModel[] = [];
  listUsedStatus: CategoryModel[] = [];
  constant = Constant;
  isShowAdvSearch = false;
  urlTreeResource = UrlConstant.RESOURCES.GET_TREE_RESOURCE;
  serviceName = MICRO_SERVICE.ADMIN;
  functionCode = FunctionCode.SYS_RESOURCES;

  constructor(
    injector: Injector,
    private readonly service: ResourcesService
  ) {
    super(injector);
    this.initDataSelect();
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.service.export(body);
    this.lockApi = (id: number | string) => this.service.lockOrUnlockById(id.toString(), UrlConstant.RESOURCES.LOCK);
    this.unlockApi = (id: number | string) => this.service.lockOrUnlockById(id.toString(), UrlConstant.RESOURCES.UN_LOCK);
    this.formConfig = {
      title: 'admin.permissions.resources.label.resource',
      content: ResourcesFormComponent
    };
    this.key = 'resourceId';
    this.serviceName = MICRO_SERVICE.ADMIN;
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
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
            return evt.status === 'INACTIVE';
          },
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunction?.delete,
          disabled: (evt: any) => {
            return evt.status === 'INACTIVE';
          },
          function: this.deleteItem
        }),
        new ChildActionSchema({
          label: 'common.button.lock',
          icon: 'lock',
          isShow: this.objFunction?.edit,
          disabled: (evt: any) => {
            return evt.status === 'INACTIVE';
          },
          function: this.lockItem
        }),
        new ChildActionSchema({
          label: 'common.button.unlock',
          icon: 'unlock',
          isShow: this.objFunction?.edit,
          disabled: (evt: any) => {
            return evt.status === 'ACTIVE';
          },
          function: this.unlockItem
        })
      ]
    });
  }

  initFormSearch() {
    this.form = this.fb.group({
        keySearch: null,
        status: null,
        url: null,
        usedStatus: null,
        parentId: null
      }
    );
  }

  initDataSelect() {
    this.listStatus = this.constant.RESOURCE_STATUS.map(item => {
      item.label = this.translate.instant(item.label);
      return item;
    });
    this.listUsedStatus = this.constant.RESOURCE_USED_STATUS.map(item => {
      item.label = this.translate.instant(item.label);
      return item;
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
        title: 'admin.permissions.resources.label.code',
        thClassList: ['text-center'],
        field: 'code',
        width: 150
      },
      {
        title: 'admin.permissions.resources.label.name',
        thClassList: ['text-center'],
        field: 'name',
        width: 200
      },
      {
        title: 'admin.permissions.resources.label.parentName',
        thClassList: ['text-center'],
        field: 'parentName',
        width: 200
      },
      {
        title: 'admin.permissions.resources.label.status',
        field: 'status',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'admin.permissions.resources.label.stt',
        field: 'orderNumber',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 50
      },
      {
        title: 'admin.permissions.resources.label.url',
        field: 'url',
        thClassList: ['text-center'],
        width: 150
      },
      {
        title: 'admin.permissions.resources.label.icon',
        field: 'icon',
        thClassList: ['text-center'],
        width: 150,
        show: false
      },
      {
        title: 'admin.permissions.resources.label.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 120,
        show: false
      },
      {
        title: 'admin.permissions.resources.label.createdDate',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'admin.permissions.resources.label.lastUpdatedBy',
        field: 'modifiedBy',
        thClassList: ['text-center'],
        width: 120,
        show: false
      },
      {
        title: 'admin.permissions.resources.label.lastUpdatedDate',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
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
        fixedDir: 'right'
      }
    ];
  }
}

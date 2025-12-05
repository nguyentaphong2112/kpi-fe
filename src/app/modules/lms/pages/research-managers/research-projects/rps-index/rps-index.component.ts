import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { ResearchProjectsModel } from '../../../../data-access/models/research-managers/research-projects.model';
import { ResearchProjectsService } from '../../../../data-access/services/research-managers/research-projects.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { Constant } from '@app/modules/lms/data-access/constants/constants';
import {
  RpsFormComponent
} from '@app/modules/lms/pages/research-managers/research-projects/rps-form/rps-form.component';

@Component({
  selector: 'app-rps-index',
  templateUrl: './rps-index.component.html',
  styleUrls: ['./rps-index.component.scss']
})


export class RpsIndexComponent extends BaseListComponent<ResearchProjectsModel> implements OnInit {
  isShowAdvSearch = false;
  functionCode = Constant.FUNCTION_CODE.RESEARCH;

  constructor(
    injector: Injector,
    private readonly service: ResearchProjectsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.key = 'researchProjectId';
    this.formConfig = {
      title: 'med.researchProjects.pageName',
      content: RpsFormComponent
    };
  }

  ngOnInit() {
    super.ngOnInit();
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
        width: 70
      },
      {
        title: 'med.researchProjects.table.title',
        field: 'title',
        thClassList: ['text-center']
      },
      {
        title: 'med.researchProjects.table.status',
        field: 'status',
        thClassList: ['text-center']
      },
      {
        title: 'med.researchProjects.table.target',
        field: 'target',
        thClassList: ['text-center']
      },
      {
        title: 'med.researchProjects.table.projectManager',
        field: 'projectManager',
        thClassList: ['text-center']
      },
      {
        title: 'med.researchProjects.table.member',
        field: 'memberName',
        thClassList: ['text-center']
      },
      {
        title: 'med.researchProjects.table.organization',
        field: 'organization',
        thClassList: ['text-center']
      },
      {
        title: 'med.researchProjects.table.createdBy',
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'med.researchProjects.table.createdTime',
        field: 'createdTime',
        width: 150,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'med.researchProjects.table.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'med.researchProjects.table.modifiedTime',
        field: 'modifiedTime',
        width: 150,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: '',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit
      }
    ];
  };
}


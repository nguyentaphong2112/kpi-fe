import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { TrainingProgramsModel } from '../../../../data-access/models/training-managers/training-programs.model';
import { TrainingProgramsService } from '../../../../data-access/services/training-managers/training-programs.service';
import { BaseListComponent } from '@core/components/base-list.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { Constant } from '@app/modules/crm/data-access/constants/constants';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import {
  TpsFormComponent
} from '@app/modules/crm/pages/training-managers/training-programs/tps-form/tps-form.component';

@Component({
  selector: 'app-tps-index',
  templateUrl: './tps-index.component.html',
  styleUrls: ['./tps-index.component.scss']
})


export class TpsIndexComponent extends BaseListComponent<TrainingProgramsModel> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.CRM_PYTAGO_RESEARCHS;

  constructor(
    injector: Injector,
    private readonly service: TrainingProgramsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.formConfig = {
      title: 'crm.trainingPrograms.table.label',
      content: TpsFormComponent
    };
    this.key = 'trainingProgramId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.view',
          icon: 'eye',
          isShow: this.objFunction?.view,
          function: this.doOpenFormDetail
        }),
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



  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null
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
        title: 'crm.trainingPrograms.table.title',
        field: 'title'
      },
      {
        title: 'crm.trainingPrograms.table.createdBy',
        field: 'createdBy',
        width: 150
      },
      {
        title: 'crm.trainingPrograms.table.createdTime',
        field: 'createdTime',
        width: 150,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'crm.trainingPrograms.table.modifiedBy',
        field: 'modifiedBy',
        width: 150
      },
      {
        title: 'crm.trainingPrograms.table.modifiedTime',
        field: 'modifiedTime',
        width: 150,
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


import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IndicatorsModel } from '../../../../data-access/models/kpi-managers/indicators.model';
import { IndicatorsService } from '../../../../data-access/services/kpi-managers/indicators.service';
import { BaseListComponent } from '@core/components/base-list.component';
import {
  IndicatorsFormComponent
} from '@app/modules/kpi/pages/kpi-managers/indicators/indicators-form/indicators-form.component';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { Mode, REQUEST_TYPE } from '@shared/constant/common';
import { CommonUtils } from '@shared/services/common-utils.service';

@Component({
  selector: 'app-indicators-index',
  templateUrl: './indicators-index.component.html',
  styleUrls: ['./indicators-index.component.scss']
})


export class IndicatorsIndexComponent extends BaseListComponent<IndicatorsModel> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.KPI_INDICATOR;
  isShowAdvSearch = false;
  actionSchemaHeader: ActionSchema;
  visibleActionsCount = 0;

  @ViewChild('significanceTpl', { static: true }) significanceTpl!: TemplateRef<any>;
  @ViewChild('measurementTpl', { static: true }) measurementTpl!: TemplateRef<any>;
  @ViewChild('systemInfoTpl', { static: true }) systemInfoTpl!: TemplateRef<any>;
  @ViewChild('noteTpl', { static: true }) noteTpl!: TemplateRef<any>;
  @ViewChild('relatedNameTpl', { static: true }) relatedNameTpl!: TemplateRef<any>;
  @ViewChild('scopeNameTpl', { static: true }) scopeNameTpl!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly indicatorService: IndicatorsService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.indicatorService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.indicatorService.getFilterResearch(body, pagination);
    this.exportApi = (body) => this.indicatorService.export(CommonUtils.convertDataSendToServer(body, true));
    this.downLoadTemplateApi = () => this.indicatorService.downloadFile('/download-template');
    this.importApi = (body) => this.indicatorService.createOrImport(body, REQUEST_TYPE.DEFAULT, '/import');
    this.doDownloadFileByNameApi = (url: string, fileName: string) => this.indicatorService.downloadFileByName(url, { fileName: fileName });
    this.formConfig = {
      title: 'kpi.indicators.table.title',
      content: IndicatorsFormComponent
    };
    this.key = 'indicatorId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.initAction();
  }


  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null,
      type: [null],
      unitId: [null],
      periodType: [null],
      significance: [null],
      measurement: [null],
      systemInfo: [null]
    });
  }

  initAction() {
    this.actionSchemaHeader = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.uploadFile',
          icon: 'upload',
          isShow: this.objFunction?.import,
          function: () => {
            this.doImportData();
          }
        }),
        new ChildActionSchema({
          label: 'common.button.export',
          icon: 'export',
          isShow: true,
          function: () => {
            this.export();
          }
        })
      ]
    });
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
    this.visibleActionsCount = this.actionSchemaHeader.arrAction.filter(it => it.isShow && it.isShowFn).length;
  }

  onClickItem(data: any) {
    this.doOpenForm(Mode.EDIT, data);
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
        title: 'kpi.indicators.table.name',
        field: 'name',
        width: 250
      },
      {
        title: 'kpi.indicators.table.type',
        field: 'typeName',
        width: 200
      },
      {
        title: 'kpi.indicators.table.unitId',
        field: 'unitName',
        width: 120
      },
      {
        title: 'kpi.indicators.table.periodType',
        field: 'periodTypeName',
        width: 120
      },
      {
        title: 'kpi.indicators.table.significance',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.significanceTpl,
        width: 250
      },
      {
        title: 'kpi.indicators.table.measurement',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.measurementTpl,
        width: 250
      },
      {
        title: 'kpi.indicators.table.systemInfo',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.systemInfoTpl,
        width: 250
      },
      {
        title: 'kpi.indicatorConversions.table.scopeNames',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.scopeNameTpl,
        width: 300
      },
      {
        title: 'kpi.indicatorConversions.table.relatedNames',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.relatedNameTpl,
        width: 300
      },
      {
        title: 'kpi.indicators.table.note',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.noteTpl,
        width: 200
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

  strReplaceSpace(str: any) {
    return str.replace(/\s/g, ' ');
  }
}


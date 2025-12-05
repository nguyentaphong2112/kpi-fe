import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ConfigMappingsModel } from '../../../../data-access/models/configurations/config-mappings.model';
import { BaseListComponent } from '@core/components/base-list.component';
import {HTTP_STATUS_CODE, MICRO_SERVICE} from '@core/constant/system.constants';
import {Mode, REQUEST_TYPE, TABLE_CONFIG_DEFAULT} from "@shared/constant/common";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {format} from "date-fns";
import {UrlConstant} from "@app/modules/admin/data-access/constants/url.constant";
import {FunctionCode} from "@shared/enums/enums-constant";
import {AppFunction} from "@core/models/app-function.interface";
import {ConfigMappingsService} from "@app/modules/admin/data-access/services/configurations/config-mappings.service";
import {MappingValuesService} from "@app/modules/admin/data-access/services/configurations/mapping-values.service";
import {CommonUtils} from "@shared/services/common-utils.service";
import {CsmFormComponent} from "@app/modules/admin/pages/categories/category-system/csm-form/csm-form.component";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {CmsFormComponent} from "@app/modules/admin/pages/configurations/config-mappings/cms-form/cms-form.component";
import {MappingValuesModel} from "@app/modules/admin/data-access/models/configurations/mapping-values.model";
import {MvsFormComponent} from "@app/modules/admin/pages/configurations/mapping-values/mvs-form/mvs-form.component";
import {DateValidator} from "@shared/custom-validator/dateValidator.class";

@Component({
  selector: 'app-mvs-index',
  templateUrl: './mvs-index.component.html',
  styleUrls: ['./mvs-index.component.scss']
})


export class MvsIndexComponent extends BaseListComponent<MappingValuesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ADMIN;
  urlLoadData = '/mapping-values';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  dataConfigMappingSelect: any;
  listConfigMapping: any;
  listConfigMappingDef: any;
  keySearchCategory: string;
  objFunctionMappingValues:AppFunction;
  titleConfig = '';
  groupType = '';
  isMenu:boolean;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  @ViewChild('basicTable', { static: true }) tableComponent!: TemplateRef<any>;

  constructor(
    injector: Injector,
    private readonly configMappingsService: ConfigMappingsService,
    private readonly mappingValuesService: MappingValuesService,
  ) {
    super(injector);
    this.initFormSearch();
    this.initDataSelect().then();
    this.isCustomSearch = true;
    this.deleteApi = (id: number | string) => this.mappingValuesService.deleteById(id.toString(), `/${this.dataConfigMappingSelect?.code}`);
    this.searchApi = (body, pagination) => this.mappingValuesService.getFilterResearch(body, pagination, `/${this.dataConfigMappingSelect?.code}`);
    this.exportApi = (body) => this.mappingValuesService.export(CommonUtils.convertDataSendToServer(body, true), `/${this.dataConfigMappingSelect?.code}/export`);
    this.importApi = (body) => this.mappingValuesService.createOrImport(body, REQUEST_TYPE.DEFAULT, `/${this.dataConfigMappingSelect?.code}/import`);
    this.downLoadTemplateApi = () => this.mappingValuesService.downloadFile(`/${this.dataConfigMappingSelect?.code}/download-template`);
    this.doDownloadFileByNameApi = (url: string) => this.mappingValuesService.downloadFile(url);
    this.serviceName = MICRO_SERVICE.ADMIN;
    this.key = 'mappingValueId';
    this.titleConfig = this.translate.instant('admin.configurations.configMappings.label.config');
    this.formConfig = {title: this.titleConfig, content: MvsFormComponent};
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.groupType = params['groupType'] ?? null;
      this.isMenu = params['isMenu']?.toUpperCase()?.includes('true'.toUpperCase());
    })
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.SYS_CONFIG_MAPPINGS}`);
    this.objFunctionMappingValues = this.sessionService.getSessionData(`FUNCTION_${FunctionCode.SYS_MAPPING_VALUES}`);
    console.log(this.objFunction,this.objFunctionMappingValues)
    this.initAction()
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
    });

    this.formImport = this.fb.group({
      startDate:[null],
      endDate:[null]
    }, {validators:
          [DateValidator.validateRangeDate('startDate', 'endDate', 'rangeDateError')]
      }
      )
  }

  afterCloseImport() {
    super.afterCloseImport();
    this.formImport.reset();
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: this.objFunctionMappingValues?.edit,
          disabled: (evt: any) => {
            return !evt;
          },
          function: this.doOpenFormEdit,
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: this.objFunctionMappingValues?.delete,
          disabled: (evt: any) => {
            return !evt;
          },
          function: this.deleteItem,
        })
      ]
    });
  }

  override beforeSearch() {
  }

  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      // el.list = this.list;
    });
  }

  override beforeExport() {
  }

  async initDataSelect(isRefresh = false) {
    const res = await this.configMappingsService.getList(null).toPromise();
    if (res.code === HTTP_STATUS_CODE.SUCCESS) {
      this.listConfigMapping = res.data.listData;
      this.listConfigMappingDef = res.data.listData;
      if (isRefresh) {
        this.changeKeySearch(this.keySearchCategory);
        this.dataConfigMappingSelect = this.listConfigMapping.find(item => item.configMappingId === this.dataConfigMappingSelect?.configMappingId);
      } else {
        this.dataConfigMappingSelect = this.listConfigMapping[0];
      }
      this.formConfig.title = this.titleConfig + `: ${this.dataConfigMappingSelect?.name}`;
      if (this.dataConfigMappingSelect) {
        this.setHeaders();
        this.search();
      }
    }
  }

  selectConfigMapping(data: any) {
    this.dataConfigMappingSelect = data;
    this.formConfig.title = this.titleConfig + `: ${data.name}`;
    this.search();
    this.setHeaders();
  }

  changeKeySearch(value: string) {
    this.listConfigMapping = this.listConfigMappingDef;
    if (value) {
      this.listConfigMapping = this.listConfigMapping.filter(item => item.name?.toLowerCase().indexOf(value.toLowerCase()) > -1);
    }
  }

  doOpenFormConfigMapping(mode: Mode, data?: ConfigMappingsModel) {
    this.modalRef = this.modal.create({
      nzWidth: this.getNzWidth() + (this.addWidth ? this.addWidth : 0),
      nzTitle: this.getModeTitle(mode) + this.translate.instant(this.titleConfig),
      nzContent: CmsFormComponent,
      nzMaskClosable: this.formConfig.isCloseModal,
      nzComponentParams: {
        mode,
        data,
        config: this.formConfig.config
      },
      nzFooter: mode !== Mode.VIEW ? this.footerTpl : null
    });
    this.modalRef.afterClose.subscribe((result) => {
        if (result?.refresh) {
          this.initDataSelect(true).then()
        }
      }
    );
  }

  override setHeaders() {
    this.tableConfig = {
      headers:  [
        {
          title: 'STT',
          thClassList: ['text-center'],
          tdClassList: ['text-center'],
          fixed: true,
          fixedDir: 'left',
          width: 20
        },
        {
          title: this.dataConfigMappingSelect?.parameterTitle,
          field: 'parameter',
          thClassList: ['text-center'],
          tdClassList: ['text-center'],
          width: 120,
        },
        {
          title: this.dataConfigMappingSelect?.valueTitle,
          field: 'value',
          thClassList: ['text-center'],
          tdClassList: ['text-center'],
          width: 120,
        },
        {
          title: 'admin.configurations.mappingValues.table.startDate',
          field: 'startDate',
          width: 120,
        },
        {
          title: 'admin.configurations.mappingValues.table.endDate',
          field: 'endDate',
          width: 120,
        },

        {
          title: 'admin.configurations.mappingValues.table.createdBy',
          field: 'createdBy',
          width: 120,
          show: false,
        },
        {
          title: 'admin.configurations.mappingValues.table.createdTime',
          field: 'createdTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'admin.configurations.mappingValues.table.modifiedBy',
          field: 'modifiedBy',
          width: 120,
          show: false,
        },
        {
          title: 'admin.configurations.mappingValues.table.modifiedTime',
          field: 'modifiedTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'admin.configurations.mappingValues.table.lastUpdateTime',
          field: 'lastUpdateTime',
          width: 120,
          show: false,
          tdClassList: ['text-center'],
          thClassList: ['text-center']
        },
        {
          title: 'common.label.attachFile',
          field: 'attachFileList',
          width: 250,
          show: false,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.attachFile
        },
        {
          title: ' ',
          field: 'action',
          tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
          width: 50,
          fieldType: 'tdTemplate',
          fieldTypeValue: this.actionTpl,
          fixed: window.innerWidth > 1024,
          fixedDir: 'right',
          show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit,
        }
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1,
      showFrontPagination: false
    };
  }

  protected readonly Mode = Mode;
}


import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Constant } from '@app/modules/kpi/data-access/constants/constants';
import { UrlConstant } from '@app/modules/kpi/data-access/constants/url.constant';
import { HTTP_STATUS_CODE, MICRO_SERVICE } from '@core/constant/system.constants';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import {
  OrganizationEvaluationsService
} from '@app/modules/kpi/data-access/services/kpi-evaluations/organization-evaluations.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { TABLE_CONFIG_DEFAULT } from '@shared/constant/common';
import { HbtTableComponent } from '@shared/component/hbt-table/hbt-table.component';
import { Validators } from '@angular/forms';
import _ from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  EvaluationResultsService
} from '@app/modules/hrm/data-access/services/staff-research/evaluation-results.service';

@Component({
  selector: 'app-oad-index',
  templateUrl: './oad-index.component.html',
  styleUrls: ['./oad-index.component.scss']
})
export class OadIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = Constant.FUNCTION_CODE.ORGANIZATION_AGGREGATE_DATA;
  urlLoadPeriod = UrlConstant.GET_EVALUATION_PERIODS;
  microService = MICRO_SERVICE;
  groupCodeList = [];
  columnList = [];
  columnListFilter = [];
  listPeriod = [];
  averageColumn = [{
    title: 'kpi.organizationAggregateData.label.average',
    field: 'average',
    thClassList: ['text-center'],
    tdClassList: ['text-right'],
    rowspan: 2,
    width: 125
  },
    {
      title: 'kpi.organizationAggregateData.label.rankOrg',
      field: 'rank',
      thClassList: ['text-center'],
      tdClassList: ['text-right'],
      rowspan: 2,
      width: 125
    }];
  columnsTable = [{
    title: 'kpi.organizationAggregateData.label.tyLeVuotDayManh',
    tdClassList: ['text-center'],
    thClassList: ['text-center'],
    width: 125,
    colspan: 2,
    child: [
      {
        title: 'kpi.organizationAggregateData.label.point',
        field: 'ty_le_vuot_day_manh',
        tdClassList: ['text-right'],
        thClassList: ['text-center'],
        width: 125
      },
      {
        title: 'kpi.organizationAggregateData.label.rank',
        field: 'xep_loai_ty_le_vuot_day_manh',
        tdClassList: ['text-center'],
        thClassList: ['text-center'],
        width: 125
      }
    ]
  },
    {
      title: 'kpi.organizationAggregateData.label.tongTrongSoVuotDayManh',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'tong_trong_so_vuot_day_manh',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_tong_trong_so_vuot_day_manh',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.mucVuotSoVoiDayManh',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'muc_vuot_so_voi_day_manh',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_muc_vuot_so_voi_day_manh',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.khctDonVi',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'khct_don_vi',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_khct_don_vi',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.tyLeVuotMucKhct',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'ty_le_vuot_muc_khct',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_ty_le_vuot_muc_khct',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.tyLeKhongHoanThanhKhct',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'ty_le_khong_hoan_thanh_khct',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_ty_le_khong_hoan_thanh_khct',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.tongSoGioGiang',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'tong_so_gio_giang',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_tong_so_gio_giang',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.tyLeVuotMucCbqt',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'ty_le_vuot_muc_cbqt',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_ty_le_vuot_muc_cbqt',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.tyLeVuotMucCbtc',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'ty_le_vuot_muc_cbtc',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_ty_le_vuot_muc_cbtc',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.phatTrienDaoTao',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'phat_trien_dao_tao',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_phat_trien_dao_tao',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.kiemDinhDaiHoc',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'kiem_dinh_dai_hoc',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_kiem_dinh_dai_hoc',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.kiemDinhThacSi',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'kiem_dinh_thac_si',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_kiem_dinh_thac_si',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.tyLeTotNghiepDungHan',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'ty_le_tot_nghiep_dung_han',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_ty_le_tot_nghiep_dung_han',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.soGiangVienDatNn',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'so_giang_vien_dat_nn',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_so_giang_vien_dat_nn',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    },
    {
      title: 'kpi.organizationAggregateData.label.soGiangVienBaoVeLats',
      tdClassList: ['text-center'],
      thClassList: ['text-center'],
      width: 125,
      colspan: 2,
      child: [
        {
          title: 'kpi.organizationAggregateData.label.point',
          field: 'so_giang_vien_bao_ve_lats',
          tdClassList: ['text-right'],
          thClassList: ['text-center'],
          width: 125
        },
        {
          title: 'kpi.organizationAggregateData.label.rank',
          field: 'xep_loai_so_giang_vien_bao_ve_lats',
          tdClassList: ['text-center'],
          thClassList: ['text-center'],
          width: 125
        }
      ]
    }];

  @ViewChild('statusTmpl', { static: true }) statusTmpl!: TemplateRef<NzSafeAny>;
  @ViewChild('tableTmpl') table!: HbtTableComponent;

  constructor(
    injector: Injector,
    private readonly service: OrganizationEvaluationsService,
    private readonly categoryService: CategoriesService,
    private readonly evaluationResultsService: EvaluationResultsService
  ) {
    super(injector);
    this.isCustomSearch = true;
    this.initFormSearch();
    this.getDataSelect();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true), '/aggregate-data/export');
    this.searchApi = (body, pagination) => this.service.getFilterResearch(body, pagination, '/aggregate-data');
  }


  getDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.KPI_PHAN_NHOM) + '?isGetAttribute=true')
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.groupCodeList = res.data;
        }
      });
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{categoryType}', this.categoryCode.SUMMARY_TABLE_ORG))
      .subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.columnList = res.data;
        }
      });
    this.evaluationResultsService.getList({ evaluationType: 2 }, '/evaluation_periods').subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listPeriod = res.data;
        if (this.listPeriod?.length > 0) {
          this.form.controls['evaluationPeriodId'].setValue(this.listPeriod[0].evaluationPeriodId);
        }
      }
    });
  }


  initFormSearch() {
    this.form = this.fb.group({
      evaluationPeriodId: [null, [Validators.required]],
      groupCode: [null, [Validators.required]],
      tableColumns: [[], [Validators.required]]
    });
    this.form.controls['groupCode'].valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if (value) {
        const column = _.clone(this.columnList);
        if (['NGD1', 'NGD2', 'NBM1', 'NBM2'].includes(this.form.controls['groupCode'].value)) {
          this.columnListFilter = column;
        } else {
          this.form.controls['tableColumns'].setValue(this.form.controls['tableColumns'].value?.filter(it => ['1', '2', '3', '4', '5', '6'].includes(it)));
          this.columnListFilter = column.filter(it => ['1', '2', '3', '4', '5', '6'].includes(it.value));
        }
      } else {
        this.columnListFilter = [];
      }
    });
  }

  override beforeRenderTable() {
    this.setHeaders();
  }

  // initAction() {
  //   this.actionSchema = new ActionSchema({
  //     arrAction: [
  //       new ChildActionSchema({
  //         label: 'kpi.organizationAggregateData.label.export',
  //         isShow: this.objFunction?.view,
  //         function: this.export.bind(this)
  //       }),
  //       new ChildActionSchema({
  //         label: 'kpi.organizationAggregateData.label.exportSchool',
  //         isShow: this.objFunction?.view,
  //         function: this.exportSchool.bind(this)
  //       })
  //     ]
  //   });
  // }

  exportSchool() {
    this.service.export(null, '/aggregate-khct-school/export').toPromise();
  }

  override setHeaders() {
    let columnTable = _.clone(this.columnsTable);
    let columnFilter = this.columnListFilter.filter(it => this.form.controls['tableColumns'].value.includes(it.value));
    columnTable = columnTable.filter(it => columnFilter.some(data => data.name == this.translate.instant(it.title)));
    if (this.form.controls['tableColumns'].value?.length > 1) {
      columnTable = [...this.averageColumn, ...columnTable];
    }
    this.tableConfig = {
      headers: [
        {
          title: 'STT',
          thClassList: ['text-center'],
          tdClassList: ['text-center'],
          fixed: true,
          fixedDir: 'left',
          width: 50,
          rowspan: 2
        },
        {
          title: 'kpi.organizationAggregateData.label.fullName',
          field: 'full_name',
          thClassList: ['text-center'],
          rowspan: 2,
          width: 350
        },
        {
          title: 'kpi.organizationAggregateData.label.totalKpi',
          field: 'totalKpi',
          thClassList: ['text-center'],
          tdClassList: ['text-right'],
          rowspan: 2,
          width: 150
        },
        {
          title: 'kpi.organizationAggregateData.label.selfTotalPoint',
          thClassList: ['text-center'],
          rowspan: 1,
          child: [
            {
              title: 'kpi.employeeSummary.label.point',
              field: 'self_total_point',
              tdClassList: ['text-right'],
              thClassList: ['text-center'],
              width: 125
            }
          ]
        },
        {
          title: 'kpi.organizationAggregateData.label.managerTotalPoint',
          thClassList: ['text-center'],
          colspan: 2,
          child: [
            {
              title: 'kpi.employeeSummary.label.point',
              field: 'manager_total_point',
              tdClassList: ['text-right'],
              thClassList: ['text-center'],
              width: 125
            },
            {
              title: 'kpi.employeeSummary.label.evaluationManage',
              field: 'result_id',
              tdClassList: ['text-center'],
              thClassList: ['text-center'],
              width: 125
            }
          ]
        },
        {
          title: 'kpi.employeeSummary.label.finalResult',
          thClassList: ['text-center'],
          colspan: 2,
          child: [
            {
              title: 'kpi.employeeSummary.label.point',
              field: 'final_point',
              tdClassList: ['text-right'],
              thClassList: ['text-center'],
              width: 125
            },
            {
              title: 'kpi.employeeSummary.label.result',
              field: 'final_result_id',
              tdClassList: ['text-center'],
              thClassList: ['text-center'],
              width: 125
            }
          ]
        },

        ...columnTable
      ],
      total: 0,
      needScroll: true,
      loading: false,
      size: 'small',
      pageSize: TABLE_CONFIG_DEFAULT.pageSize,
      pageIndex: 1
    };
  }

}

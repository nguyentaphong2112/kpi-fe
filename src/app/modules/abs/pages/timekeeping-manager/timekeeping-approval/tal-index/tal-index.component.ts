import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BaseListComponent} from "@core/components/base-list.component";
import {
  AttendanceHistoriesModel
} from "@app/modules/abs/data-access/models/timekeeping-manager/attendance-histories.model";
import {HTTP_STATUS_CODE, MICRO_SERVICE} from "@core/constant/system.constants";
import {UrlConstant as UrlConstantShare} from "@shared/constant/url.class";
import {Mode, REQUEST_TYPE, TABLE_CONFIG_DEFAULT} from "@shared/constant/common";
import {
  AttendanceHistoriesService
} from "@app/modules/abs/data-access/services/timekeeping-manager/attendance-histories.service";
import {ToastrService} from "ngx-toastr";

import {_variable} from "@core/global-style/_variable";
import {CommonUtils} from "@shared/services/common-utils.service";
import {ActionSchema, ChildActionSchema} from "@core/models/action.model";
import {Constant} from "@app/modules/abs/data-access/constant/constant.class";
import * as moment from "moment/moment";
import {FormGroup, Validators} from "@angular/forms";
import {CategoryModel} from "@core/models/category-common.interface";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {Utils} from "@core/utils/utils";
import {UrlConstant} from "@app/modules/abs/data-access/constant/url.class";
import {ObjectUtil} from "@core/utils/object.util";
import {FunctionCode} from "@shared/enums/enums-constant";

@Component({
  selector: 'app-tal-index',
  templateUrl: './tal-index.component.html',
  styleUrls: ['./tal-index.component.scss']
})
export class TalIndexComponent extends BaseListComponent<AttendanceHistoriesModel> implements OnInit {
  serviceName = MICRO_SERVICE.ABS;
  urlLoadData = '/timekeeping-approval';
  urlConstantShare = UrlConstantShare;
  microService = MICRO_SERVICE;
  functionCode = FunctionCode.ABS_TIMEKEEPING_APPROVAL;
  _variable = _variable
  Mode = Mode
  isVisible = false;
  formModal: FormGroup;
  listStatus: CategoryModel[] = [];
  statusCodeList: NzSafeAny[] = [];
  statusCode = Constant.ATTENDANCE_HISTORIES_STATUS;
  @ViewChild('attachFileTmpl', { static: true }) attachFile!: TemplateRef<any>;
  @ViewChild('processTmpl', { static: true }) processTmpl!: TemplateRef<any>;


  constructor(
    injector: Injector,
    private readonly service: AttendanceHistoriesService,
    protected toastrService :ToastrService,
  ) {
    super(injector);
    this.listStatus = ObjectUtil.optionsToList(Constant.LIST_STATUS, this.translate);
    this.initFormSearch();
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.serviceName = MICRO_SERVICE.ABS;
    this.key = 'attendanceHistoryId';
  }

  ngOnInit() {
    super.ngOnInit();
    this.objFunction = this.sessionService.getSessionData(`FUNCTION_${this.functionCode}`);
    this.initAction();
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch:[null]
    },{
     });

    this.formModal = this.fb.group({
      note: [null],
      statusId: [this.statusCode.PHE_DUYET, [Validators.required]],
      attendanceHistoryId: [null, [Validators.required]]
    });
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'abs.attendanceHistories.tooltip.approve',
          icon: 'check',
          isShowFn: (evt:any) => (evt.statusId === Constant.ATTENDANCE_HISTORIES_STATUS.CHO_PHE_DUYET),
          function: (evt:any) => {
            this.openModal(evt.attendanceHistoryId)
          }
        })
      ]
    });
  }

  openModal(id: number) {
    this.formModal.controls['attendanceHistoryId'].setValue(id);
    this.formModal.controls['note'].setValue(null);
    this.formModal.controls['statusId'].setValue(this.statusCode.PHE_DUYET);
    this.isVisible = true;
    this.isSubmitted = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isSubmitted = true;
    if (this.formModal.valid) {
      this.updateStatus(this.formModal.controls['statusId'].value, this.formModal.controls['attendanceHistoryId'].value, this.formModal.controls['note'].value);
      this.isSubmitted = false;
      this.isVisible = false;
    }
  }

  updateStatus(type: string, id: number, note: string) {
    this.service.createOrImport({
      statusId: type,
      approvedNote: note
    }, REQUEST_TYPE.DEFAULT, UrlConstant.ATTENDANCE_HISTORIES.STATUS + id).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.toast.success(this.translate.instant('common.notification.updateSuccess'));
        this.search();
      }
    });
  }


  override beforeRenderTable() {
    this.responseSearch.data.listData.forEach(el => {
      el.checkInTime = moment(el.checkInTime).format("HH:mm")
      el.checkOutTime = moment(el.checkOutTime).format("HH:mm")
      el.validCheckInTime = moment(el.validCheckInTime).format("HH:mm")
      el.validCheckOutTime = moment(el.validCheckOutTime).format("HH:mm")
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
        title: 'abs.attendanceHistories.table.employeeCode',
        field: 'employeeCode',
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.attendanceHistories.table.employeeName',
        field: 'employeeName',
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.attendanceHistories.table.dateTimekeeping',
        field: 'dateTimekeeping',
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.attendanceHistories.table.checkInTime',
        field: 'checkInTime',
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.attendanceHistories.table.checkOutTime',
        field: 'checkOutTime',
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.attendanceHistories.table.validCheckInTime',
        field: 'validCheckInTime',
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.attendanceHistories.table.validCheckOutTime',
        field: 'validCheckOutTime',
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.attendanceHistories.table.reason',
        field: 'reasonName',
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.attendanceHistories.table.status',
        field: 'statusName',
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.attendanceHistories.table.processStatus',
        fieldType:'tdTemplate',
        fieldTypeValue: this.processTmpl,
        width: 100,
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
      },
      {
        title: 'abs.annualLeaves.table.createdBy',
        field: 'createdBy',
        width: 150,
        show: false
      },
      {
        title: 'abs.annualLeaves.table.createdTime',
        field: 'createdTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.annualLeaves.table.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        show: false
      },
      {
        title: 'abs.annualLeaves.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: ' ',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit
      }
    ];

  }


  protected readonly Constant = Constant;
}

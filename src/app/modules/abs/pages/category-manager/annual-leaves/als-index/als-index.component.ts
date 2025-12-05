import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { CommonUtils } from '@shared/services/common-utils.service';
import { AnnualLeavesService } from '@app/modules/abs/data-access/services/category-manager/annual-leaves.service';
import { AnnualLeavesModel } from '@app/modules/abs/data-access/models/category-manager/annual-leaves.model';
import { FunctionCode } from '@shared/enums/enums-constant';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { AlsFormComponent } from '@app/modules/abs/pages/category-manager/annual-leaves/als-form/als-form.component';
import { Scopes } from '@core/utils/common-constants';
import { Constant } from '@app/modules/lms/data-access/constants/constants';
import {Validators} from "@angular/forms";
import {Utils} from "@core/utils/utils";
import {debounceTime, distinctUntilChanged} from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { HTTP_STATUS_CODE } from '@app/core/constant/system.constants';

@Component({
  selector: 'app-als-index',
  templateUrl: './als-index.component.html',
  styleUrls: ['./als-index.component.scss']
})


export class AlsIndexComponent extends BaseListComponent<AnnualLeavesModel> implements OnInit {
  isShowAdvSearch = false;
  functionCode = FunctionCode.ABS_ANNUAL_LEAVES;
  scope: string = Scopes.VIEW;
  functionCodeEmployee = FunctionCode.HR_PERSONAL_INFO;
  currDate = new Date();
  toastrService: ToastrService;

  constructor(
    injector: Injector,
    private readonly service: AnnualLeavesService
  ) {
    super(injector);
    this.initFormSearch();
    this.deleteApi = (id: number | string) => this.service.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.service.getFilterResearch(CommonUtils.convertDataSendToServer(body, true), pagination);
    this.exportApi = (body) => this.service.export(CommonUtils.convertDataSendToServer(body, true));
    this.formConfig = {
      title: 'abs.annualLeaves.label.annualLeave',
      content: AlsFormComponent
    };


  }
  calculateAnnualLeave(){
    if (this.form.valid) {
          this.isLoading = true;
          const formValue = this.form.value;
          const data = CommonUtils.convertDataSendToServer(formValue);
          this.service.calculateAnnualLeave(data).subscribe(res => {
            if (res.code === HTTP_STATUS_CODE.SUCCESS) {
              this.search(1);
              this.isLoading = false;
              this.toastrService?.success(res.message);
            } else {
              this.toastrService?.error(res.message);
            }
          }, () => {
            this.isLoading = false;
          });
        }
  }
  ngOnInit() {
    super.ngOnInit();
    this.initAction();
    this.onChangeYear();
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: [null],
      employeeId: null,
      startDate: null,
      endDate: null,
      year: [this.currDate.getFullYear().toString(),Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  beforeSearch() {
    this.params = {
      year:Utils.convertDateToSendServer(this.f.year.value,'yyyy')
    }
  }

  beforeExport() {
    this.params = {
      year:Utils.convertDateToSendServer(this.f.year.value,'yyyy')
    }
  }

  onChangeYear() {
    if(this.f.year){
      this.f.year.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
        .subscribe(newValue => {
          this.search()
        })
    }
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'eye',
          isShow: this.objFunction?.edit,
          function: this.doOpenFormEdit
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
        rowspan: 2,
        width: 70
      },
      {
        title: 'abs.annualLeaves.table.employeeCode',
        field: 'employeeCode',
        width: 75,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'abs.annualLeaves.table.fullName',
        field: 'employeeName',
        width: 180,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'abs.annualLeaves.table.startDate',
        field: 'startDate',
        width: 100,
        rowspan: 2,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.annualLeaves.table.endDate',
        field: 'endDate',
        width: 100,
        rowspan: 2,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.annualLeaves.table.seniority',
        field: 'seniority',
        width: 50,
        rowspan: 2,
        thClassList: ['text-center'],
        tdClassList: ['text-right']
      },
      {
        title: 'abs.annualLeaves.table.remains',
        width: 100,
        colspan: 2,
        thClassList: ['text-center'],
        child: [
          {
            title: 'abs.annualLeaves.table.remainLastYearDays',
            field: 'remainLastYearDays',
            width:50,
            thClassList: ['text-center'],
            tdClassList: ['text-right']
          },
          {
            title: 'abs.annualLeaves.table.annualDays',
            field: 'annualDays',
            width:50,
            thClassList: ['text-center'],
            tdClassList: ['text-right']
          }
        ]
      },
      {
        title: 'abs.annualLeaves.table.used',
        width: 100,
        colspan: 2,
        thClassList: ['text-center'],
        child: [
          {
            title: 'abs.annualLeaves.table.usedLastYearDays',
            field: 'usedLastYearDays',
            width:50,
            thClassList: ['text-center'],
            tdClassList: ['text-right']
          },
          {
            title: 'abs.annualLeaves.table.usedDays',
            field: 'usedDays',
            width:50,
            thClassList: ['text-center'],
            tdClassList: ['text-right']
          }
        ]
      },
      {
        title: 'abs.annualLeaves.table.remainDays',
        field: 'remainDays',
        rowspan: 2,
        width: 50,
        thClassList: ['text-center'],
        tdClassList: ['text-right']
      },
      {
        title: 'abs.annualLeaves.table.status',
        field: 'status',
        rowspan: 2,
        width: 100,
        thClassList: ['text-center']
      },
      {
        title: 'abs.annualLeaves.table.positionName',
        field: 'jobName',
        width: 180,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'abs.annualLeaves.table.orgName',
        field: 'organizationName',
        width: 250,
        rowspan: 2,
        thClassList: ['text-center']
      },
      {
        title: 'abs.annualLeaves.table.createdBy',
        field: 'createdBy',
        rowspan: 2,
        width: 150,
        show: false
      },
      {
        title: 'abs.annualLeaves.table.createdTime',
        field: 'createdTime',
        width: 120,
        rowspan: 2,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'abs.annualLeaves.table.modifiedBy',
        field: 'modifiedBy',
        width: 150,
        rowspan: 2,
        show: false
      },
      {
        title: 'abs.annualLeaves.table.modifiedTime',
        field: 'modifiedTime',
        width: 120,
        rowspan: 2,
        show: false,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: ' ',
        field: 'action',
        tdClassList: ['text-nowrap', 'text-center'], thClassList: ['text-nowrap', 'text-center'],
        width: 50,
        rowspan: 2,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: window.innerWidth > 1024,
        fixedDir: 'right',
        show: this.objFunction?.approve || this.objFunction?.delete || this.objFunction?.edit
      }
    ];
  }
}


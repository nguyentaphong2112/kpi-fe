import { Component, Injector, OnInit } from '@angular/core';
import { FunctionCode } from '@shared/enums/enums-constant';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import {
  PasFormComponent
} from '@app/modules/hrm/pages/staff-research/planning-assignments/pas-form/pas-form.component';
import { HBTTableHeader } from '@shared/component/hbt-table/hbt-table.interfaces';
import { Validators } from '@angular/forms';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-pas-index',
  templateUrl: './pas-index.component.html',
  styleUrls: ['./pas-index.component.scss']
})
export class PasIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {
  functionCode = FunctionCode.HR_PLANNING_ASSIGNMENTS;
  moduleName = Constant.MODULE_NAME.PLANNING_ASSIGNMENTS;
  urlConstant = UrlConstant;
  fileExportName = 'thong_tin_quy_hoach.xlsx';
  formConfig = {
    title: 'hrm.staffManager.staffResearch.pageName.planningAssignmentInfo',
    content: PasFormComponent
  };
  tableHeaders: HBTTableHeader[] = [
    {
      title: 'STT',
      thClassList: ['text-center'],
      tdClassList: ['text-center'],
      fixedDir: 'left',
      width: 50,
      fixed: window.innerWidth > 1024
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.employeeCode',
      field: 'employeeCode',
      width: 120,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.fullName',
      field: 'fullName',
      width: 150,
      fixed: window.innerWidth > 1024,
      fixedDir: 'left'
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.orgName',
      field: 'orgName',
      width: 200
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.empTypeName',
      field: 'empTypeName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.personalInformation.table.positionName',
      field: 'jobName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.planningPeriodId',
      field: 'planningPeriodName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.positionId',
      field: 'positionName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.documentNo',
      field: 'documentNo',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.documentSignedDate',
      field: 'documentSignedDate',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.startDate',
      field: 'startDate',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.endDate',
      field: 'endDate',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.endReasonId',
      field: 'endReasonName',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.endDocumentNo',
      field: 'endDocumentNo',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.endDocumentSignedDate',
      field: 'endDocumentSignedDate',
      width: 120
    },
    {
      title: 'hrm.staffManager.staffResearch.planningAssignment.table.flagStatus',
      field: 'empStatusName',
      width: 120,
      show: false
    },
    {
      title: 'common.label.createdBy',
      field: 'createdBy',
      width: 150,
      show: false
    },
    {
      title: 'common.label.createdTime',
      tdClassList: ['text-center'],
      field: 'createdTime',
      width: 120,
      show: false
    },
    {
      title: 'common.label.modifiedBy',
      field: 'modifiedBy',
      width: 150,
      show: false
    },
    {
      title: 'common.label.modifiedTime',
      tdClassList: ['text-center'],
      field: 'modifiedTime',
      width: 120,
      show: false
    }
  ];

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.initFormImport();
  }

  initFormImport() {
    this.formImport = this.fb.group({
      isForceUpdate: [false, [Validators.required]]
    });
  }
}

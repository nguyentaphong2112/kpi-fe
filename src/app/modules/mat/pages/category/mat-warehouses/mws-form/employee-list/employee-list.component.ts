import {Component, EventEmitter, Injector, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import {UrlConstant as UrlConstantShare} from '@shared/constant/url.class';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})

export class EmployeeListComponent extends BaseListComponent<any> implements OnInit {
  @Input() isDetail = true;
  @ViewChild('attachFileTmpl', {static: true}) attachFile!: TemplateRef<any>;
  @ViewChild('isManagerTmpl', {static: true}) isManager!: TemplateRef<any>;
  @ViewChild('incomingApproveTmpl', {static: true}) incomingApprove!: TemplateRef<any>;
  @ViewChild('transferringApproveTmpl', {static: true}) transferringApprove!: TemplateRef<any>;
  @ViewChild('outgoingApproveTmpl', {static: true}) outgoingApprove!: TemplateRef<any>;
  @ViewChild('adjustmentApproveTmpl', {static: true}) adjustmentApprove!: TemplateRef<any>;

  @Output() listEmpIdsChange = new EventEmitter<number[]>();

  constructor(
    injector: Injector,
  ) {
    super(injector);
    this.isCustomSearch = true;
    this.key = 'employeeId';
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


  override setHeaders() {
    this.tableConfig.showFrontPagination = false;
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
        title: 'mat.matWarehouses.emp.isManager',
        field: 'isManager',
        width: 120,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.isManager,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.emp.employeeCode',
        field: 'employeeCode',
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.emp.fullName',
        field: 'fullName',
        width: 120,
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.emp.mobileNumber',
        field: 'mobileNumber',
        width: 120,
        thClassList: ['text-center'],
      },
      {
        title: 'mat.matWarehouses.emp.email',
        field: 'email',
        width: 120,
        thClassList: ['text-center'],
      },
      {
        title: 'mat.matWarehouses.emp.incomingApprove',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.incomingApprove,
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.emp.transferringApprove',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.transferringApprove,
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.emp.outgoingApprove',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.outgoingApprove,
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
      },
      {
        title: 'mat.matWarehouses.emp.adjustmentApprove',
        fieldType: 'tdTemplate',
        fieldTypeValue: this.adjustmentApprove,
        width: 120,
        tdClassList: ['text-center'],
        thClassList: ['text-center']
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
        show: !this.isDetail,
      }
    ];
  }

  changeManager(event: any, data: any) {
    if (event) {
      this.tableData.forEach(el => el.isManager = false);
      data.isManager = true;
    } else {
      this.tableData[0].isManager = true;
    }
  }

  override processDeleteData(id: number) {
    this.tableData = this.tableData.filter(el => el[this.key] !== id);
    if (this.tableData.length > 0) {
      this.listEmpIdsChange.emit(this.tableData.map(el => el[this.key]));
    } else {
      this.listEmpIdsChange.emit(null);
    }
  }
}


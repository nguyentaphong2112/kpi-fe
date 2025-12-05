import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Validators } from '@angular/forms';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { CategoriesService } from '@app/modules/kpi/data-access/other-services/categories.service';
import { CategoryModel } from '@core/models/category-common.interface';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { distinctUntilChanged } from 'rxjs';
import _ from 'lodash';
import { $e } from 'codelyzer/angular/styles/chars';

@Component({
  selector: 'app-assignment-modal',
  templateUrl: './assignment-modal.component.html',
  styleUrls: ['./assignment-modal.component.scss']
})
export class AssignmentModalComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  listType: CategoryModel[] = [];

  constructor(
    injector: Injector,
    private readonly categoryService: CategoriesService) {
    super(injector);
    this.initDataSelect();
  }

  ngOnInit(): void {
    this.initFormSearch();
  }

  initFormSearch() {
    this.form = this.fb.group({
      leaderType: [this.data.leaderType || null, Validators.required],
      collaboratorType: [this.data.collaboratorType || null, Validators.required],
      leaderIds: [(this.data.leaderType == 3 ? this.data?.leaderIds?.split(';').map(id => Number(id)) : this.data?.leaderIds?.split(';')) || null, Validators.required],
      collaboratorIds: [(this.data.collaboratorType == 3 ? this.data?.collaboratorIds?.split(';').map(id => Number(id)) : this.data?.collaboratorIds?.split(';')) || null, Validators.required],
      assignmentNote: [this.data.assignmentNote || null],
      leaderName: this.data.leaderName,
      collaboratorName: this.data.collaboratorName
    });
    this.form.get('leaderType')?.valueChanges.pipe(distinctUntilChanged()).subscribe(data => {
      if (data) {
        this.form.get('leaderIds').setValue(null);
      }
    });
    this.form.get('collaboratorType')?.valueChanges.pipe(distinctUntilChanged()).subscribe(data => {
      if (data) {
        this.form.get('collaboratorIds').setValue(null);
      }
    });
  }

  initDataSelect() {
    this.categoryService.getList(null, UrlConstant.CATEGORY.GET_CATEGORIES.replace('{typeCode}', this.categoryCode.KPI_ASSIGNMENT_TYPE), true)
      .subscribe(res => {
        this.listType = res.data;
      });
  }

  selectValue() {
    this.isSubmitted = true;
    if (this.form.valid) {
      let data = _.clone(this.form.value);
      data = { ...data, leaderIds: data.leaderIds.join(';'), collaboratorIds: data.collaboratorIds.join(';') };
      this.modalRef?.close({ data: data });
    }
  }

  getUnit($event, name: string, nameType: string) {
    if (this.f[nameType].value == 2) {
      if ($event.listItemSelected && $event.listItemSelected.length > 0) {
        this.f[name].setValue($event.listItemSelected.map((item: any) => item.name).join(', '));
      }
    }
  }

  getOrgName($event, name: string, nameType: string) {
    if (this.f[nameType].value == 1) {
      if ($event && $event.length > 0) {
        this.f[name].setValue($event.map((item: any) => item.name).join(', '));
      }
    }
  }

  getPersonName($event, name: string, nameType: string) {
    if (this.f[nameType].value == 3) {
      if ($event.listItemSelected && $event.listItemSelected.length > 0) {
        this.f[name].setValue($event.listItemSelected.map((item: any) => item.fullName).join(', '));
      }
    }
  }

  protected readonly constant = Constant;
  protected readonly $e = $e;
}

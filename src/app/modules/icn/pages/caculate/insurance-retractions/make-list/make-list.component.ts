import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import {
  InsuranceRetractionsService
} from '@app/modules/icn/data-access/services/caculate/insurance-retractions.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { InsuranceRetractionsModel } from '@app/modules/icn/data-access/models/caculate/insurance-retractions.model';
import { Validators } from '@angular/forms';
import { DateValidator } from '@shared/custom-validator/dateValidator.class';
import { catchError } from 'rxjs/operators';
import { finalize, throwError } from 'rxjs';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';

@Component({
  selector: 'app-make-list',
  templateUrl: './make-list.component.html',
  styleUrls: ['./make-list.component.scss']
})
export class MakeListComponent extends BaseFormComponent<any> implements OnInit {

  constructor(
    private readonly service: InsuranceRetractionsService,
    private changeDetectorRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector);
    this.key = 'insuranceRetractionId';

  }

  override initForm() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    this.form = this.fb.group({
        keySearch: [null],
        startDate: [null, [Validators.required]],
        endDate: [currentDate, [Validators.required]]

      },
      {
        validators:
          [DateValidator.validateTwoDate('startDate', 'endDate', 'greaterAndEqual')]
      });
  }

  public onSubmit() {
    this.isLoading = true;
    this.isSubmitted = true;
    if (this.form.invalid) {
      return null;
    }
    const form = this.form.getRawValue();
    const listPeriodDate = this.getListOfMonths(this.form.get('startDate').value, this.form.get('endDate').value);
    this.calculateByFirstMonth(listPeriodDate, form);
  }

  calculateByFirstMonth(listPeriodDate: any[], form: any) {
    const data = { listPeriodDate: listPeriodDate, empCodes: form.keySearch ? form.keySearch : '' };
    if (!form.keySearch) {
      delete data.empCodes;
    }
    const subscription = this.service.onCalculateList(data)
      .pipe(
        catchError(err => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
          return throwError(err);
        })
      )
      .subscribe(res => {
        this.isLoading = false;
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          if (res.data == 0) {
            this.toast.error(this.translate.instant('common.notification.nonMakeList'));
          } else {
            this.toast.success(res.message);
          }
          this.modalRef?.close({ refresh: true });
        }
        this.changeDetectorRef.detectChanges();
      });
    this.subscriptions.push(subscription);
  }

  getListOfMonths(startDate: Date, endDate: Date): string[] {
    const monthsList: string[] = [];
    const currentDate = new Date(startDate);

    currentDate.setDate(1);
    endDate = new Date(endDate);
    endDate.setDate(1);

    while (
      currentDate.getFullYear() < endDate.getFullYear() ||
      (currentDate.getFullYear() === endDate.getFullYear() &&
        currentDate.getMonth() <= endDate.getMonth())
      ) {
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const monthString =
        '01/' + (currentMonth < 10 ? '0' : '') + currentMonth + '/' + currentYear;

      monthsList.push(monthString);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return monthsList;
  }
}

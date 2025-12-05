import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Mode } from '@shared/constant/common';

@Component({
  selector: 'app-view-indicator',
  templateUrl: './view-indicator.component.html',
  styleUrls: ['./view-indicator.component.scss']
})
export class ViewIndicatorComponent extends BaseFormComponent<NzSafeAny> implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.form.patchValue(this.data);
    if (this.mode === Mode.VIEW) {
      this.form.disable();
    }
  }

  override initForm() {
    this.form = this.fb.group({
      indicatorName: [null],
      typeName: [null],
      measureUnit: [null],
      periodTypeName: [null],
      significance: [null],
      measurement: [null],
      systemInfo: [null]
    });
  }

}

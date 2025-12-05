import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { FormGroup } from '@angular/forms';
import { ObjectUtil } from '@core/utils/object.util';
import { Constant } from '@app/modules/exam/data-access/constants/constants';

@Component({
  selector: 'app-rule-form',
  templateUrl: './rule-form.component.html',
  styleUrls: ['./rule-form.component.scss']
})
export class RuleFormComponent extends BaseFormComponent<any> implements OnInit {

  @Input() form: FormGroup;
  @Input() isSubmitted = false;

  listVisibilityCode = [];

  constructor(
    injector: Injector
  ) {
    super(injector);
  }


  ngOnInit(): void {
    this.listVisibilityCode = ObjectUtil.optionsToList(Constant.LIST_VISIBILITY_CODE, this.translate);
  }

}

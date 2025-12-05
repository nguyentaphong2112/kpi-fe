import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormComponent } from '@core/components/base-form.component';

@Component({
  selector: 'app-after-submit-form',
  templateUrl: './after-submit-form.component.html',
  styleUrls: ['./after-submit-form.component.scss']
})
export class AfterSubmitFormComponent extends BaseFormComponent<any> implements OnInit {


  @Input() form: FormGroup;
  @Input() isSubmitted = false;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }


  ngOnInit(): void {
  }

}

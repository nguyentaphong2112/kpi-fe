import { Component, Injector, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormComponent } from '@core/components/base-form.component';

@Component({
  selector: 'app-time-form',
  templateUrl: './time-form.component.html',
  styleUrls: ['./time-form.component.scss']
})
export class TimeFormComponent extends BaseFormComponent<any> implements OnInit {

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

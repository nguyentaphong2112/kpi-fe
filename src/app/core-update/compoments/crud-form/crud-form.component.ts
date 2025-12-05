import { Component, Input, OnInit } from '@angular/core';
import { CrudFormSetting } from '@app/core-update/class/form-schema';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss']
})
export class CrudFormComponent implements OnInit {

  form!: FormGroup;
  isInitFormSuccess = false;
  isSubmitted = false;
  @Input() setting: CrudFormSetting = new CrudFormSetting();
  _modelData: any = {};
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    const form = {};
    for (const schema of this.setting.schema) {
      form[schema.field] = [schema.defaultValue, schema['validators']];
    }
    this.form = this.fb.group(form, {validators: this.setting.validators, asyncValidators: this.setting.asyncValidators});
    this.isInitFormSuccess = true;
  }

  get f() {
    return this.form.controls;
  }

}

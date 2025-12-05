import { Component, Injector, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { DataService } from '@shared/services/data.service';
import { CommonUtils } from '@shared/services/common-utils.service';
import { REQUEST_TYPE } from '@shared/constant/common';
import { FormArray, Validators } from '@angular/forms';
import { MemberService } from '@app/modules/library/data-access/services/member.service';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { MICRO_SERVICE } from '@core/constant/system.constants';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {DateValidator} from '@shared/custom-validator/dateValidator.class';
import { format } from 'date-fns';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss']
})
export class MemberFormComponent extends BaseFormComponent<NzSafeAny> implements OnInit {
  constant = Constant;
  urlLoadGender = UrlConstant.CATEGORIES.NODE_GENDER;
  serviceName = MICRO_SERVICE.ADMIN;

  constructor(injector: Injector,
              private memberService: MemberService,
              private dataService: DataService) {
    super(injector);
    this.findOneById = (id) => this.memberService.findOneById(id);
    this.createApi = (body: any) => this.memberService.createOrImport(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.updateApi = (body: any) => this.memberService.update(CommonUtils.convertDataSendToServer(body), REQUEST_TYPE.DEFAULT);
    this.getConfigAttributeApi = () => this.dataService.getAttributeConfig({
      tableName: 'lib_members'
    });
    this.isPage = false;
    this.key = 'memberId';
    this.getConfigAttributes();
  }

  override initForm() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(255)]],
      code: [null, [Validators.required, Validators.maxLength(255)]],
      dateOfBirth: [null, [Validators.required , DateValidator.onlyLowerTodayDate]],
      genderId: [null, [Validators.required]],
      listAttributes: this.fb.array([])
    });
    this.attributesFormArray = this.form?.get('listAttributes') as FormArray;
  }

  get f() {
    return this.form.controls;
  }

  beforeSave() {
    this.body.dateOfBirth = format(this.f.dateOfBirth.value, 'dd/MM/yyyy');
  }

}

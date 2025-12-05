import { Component, Injector, OnInit } from '@angular/core';
import { BaseListComponent } from '@core/components/base-list.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { ActionSchema, ChildActionSchema } from '@core/models/action.model';
import { MemberService } from '@app/modules/library/data-access/services/member.service';
import { MemberFormComponent } from '@app/modules/library/pages/members/member-form/member-form.component';
import { UrlConstant } from '@app/modules/library/data-access/constants/url.constant';
import { MICRO_SERVICE } from '@core/constant/system.constants';

@Component({
  selector: 'app-member-index',
  templateUrl: './member-index.component.html',
  styleUrls: ['./member-index.component.scss']
})
export class MemberIndexComponent extends BaseListComponent<NzSafeAny> implements OnInit {

  constant = Constant;
  urlLoadGender = UrlConstant.CATEGORIES.NODE_GENDER;
  serviceName = MICRO_SERVICE.ADMIN;

  constructor(injector: Injector,
              private memberService: MemberService) {
    super(injector);
    this.initFormSearch();
    this.initAction();
    this.deleteApi = (id: number | string) => this.memberService.deleteById(id.toString());
    this.searchApi = (body, pagination) => this.memberService.getFilterResearch(body, pagination);
    this.key = 'memberId';
    this.formConfig = {
      title: 'library.member.label.member',
      content: MemberFormComponent
    };
  }

  initFormSearch() {
    this.form = this.fb.group({
      keySearch: null,
      genderId: null
    });
  }

  initAction() {
    this.actionSchema = new ActionSchema({
      arrAction: [
        new ChildActionSchema({
          label: 'common.button.edit',
          icon: 'edit',
          isShow: !this.objFunction?.edit,
          function: this.doOpenFormEdit
        }),
        new ChildActionSchema({
          label: 'common.button.delete',
          icon: 'delete',
          isShow: !this.objFunction?.delete,
          function: this.deleteItem
        })
      ]
    });
  }

  override setHeaders() {
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
        title: 'library.member.label.name',
        field: 'name',
        thClassList: ['text-center']
      },
      {
        title: 'library.member.label.code',
        thClassList: ['text-center'],
        field: 'code'
      },
      {
        title: 'library.member.label.genderId',
        thClassList: ['text-center'],
        field: 'genderName'
      },
      {
        title: 'library.member.label.dateOfBirth',
        thClassList: ['text-center'],
        field: 'dateOfBirth'
      },
      {
        title: 'library.member.label.createdTime',
        field: 'createdTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100
      },
      {
        title: 'library.member.label.createdBy',
        field: 'createdBy',
        thClassList: ['text-center'],
        width: 100
      },
      {
        title: 'library.member.label.modifiedTime',
        field: 'modifiedTime',
        thClassList: ['text-center'],
        tdClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: 'library.member.label.modifiedBy',
        field: 'modifiedBy',
        thClassList: ['text-center'],
        width: 100,
        show: false
      },
      {
        title: '',
        tdClassList: ['text-nowrap', 'text-center'],
        thClassList: ['text-nowrap', 'text-center'],
        width: 80,
        fieldType: 'tdTemplate',
        fieldTypeValue: this.actionTpl,
        fixed: true,
        fixedDir: 'right'
      }
    ];
  }


}

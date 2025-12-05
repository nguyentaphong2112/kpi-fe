import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MembersRoutingModule } from './members.routing.module';
import { MemberIndexComponent } from '@app/modules/library/pages/members/member-index/member-index.component';
import { MemberFormComponent } from '@app/modules/library/pages/members/member-form/member-form.component';

@NgModule({
  declarations: [
    MemberIndexComponent,
    MemberFormComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    SharedModule,
    NzFormModule,
    NzGridModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})

export class MembersModule { }

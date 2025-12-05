import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentTypesRoutingModule } from './document-types.routing.module';
import { DtsIndexComponent } from './dts-index/dts-index.component';
import { DtsFormComponent } from './dts-form/dts-form.component';
import { SharedModule } from '@shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DtsIndexComponent,
    DtsFormComponent
  ],
  imports: [
    CommonModule,
    DocumentTypesRoutingModule,
    SharedModule,
    NzFormModule,
    NzGridModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class DocumentTypesModule { }

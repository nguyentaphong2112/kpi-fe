import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributesRoutingModule } from './attributes.routing.module';
import { AttributeIndexComponent } from './attribute-index/attribute-index.component';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AttributeFormComponent } from './attribute-form/attribute-form.component';


@NgModule({
  declarations: [
    AttributeIndexComponent,
    AttributeFormComponent
  ],
  imports: [
    CommonModule,
    AttributesRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class AttributesModule { }

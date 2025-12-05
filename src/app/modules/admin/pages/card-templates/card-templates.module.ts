import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTemplatesRoutingModule } from '@app/modules/admin/pages/card-templates/card-templates.routing.module';
import { CtsFormComponent } from '@app/modules/admin/pages/card-templates/cts-form/cts-form.component';
import { CtsIndexComponent } from '@app/modules/admin/pages/card-templates/cts-index/cts-index.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [CtsFormComponent, CtsIndexComponent],
  imports: [
    CommonModule,
    CardTemplatesRoutingModule,
    SharedModule
  ]
})
export class CardTemplatesModule { }

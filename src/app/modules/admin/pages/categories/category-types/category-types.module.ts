import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtsIndexComponent } from './cts-index/cts-index.component';
import { CtsFormComponent } from './cts-form/cts-form.component';
import { CategoryTypesRoutingModule } from '@app/modules/admin/pages/categories/category-types/category-types.routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    CtsIndexComponent,
    CtsFormComponent
  ],
  imports: [
    CommonModule,
    CategoryTypesRoutingModule,
    SharedModule
  ]
})
export class CategoryTypesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { CsmIndexComponent } from './csm-index/csm-index.component';
import { CsmFormComponent } from './csm-form/csm-form.component';
import { CategorySystemRoutingModule } from '@app/modules/admin/pages/categories/category-system/category-system.routing.module';

@NgModule({
  declarations: [CsmIndexComponent, CsmFormComponent],
  imports: [
    CommonModule,
    CategorySystemRoutingModule,
    NzFormModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CategorySystemModule {
}

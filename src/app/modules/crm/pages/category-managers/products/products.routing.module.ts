import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductsIndexComponent } from '@app/modules/crm/pages/category-managers/products/products-index/products-index.component';
import { ProductsFormComponent } from '@app/modules/crm/pages/category-managers/products/products-form/products-form.component';


const routes: Routes = [
  {
    path: '',
    component: ProductsIndexComponent
  },
  {
    path: 'form',
    component: ProductsFormComponent,
    data: {
      isShowBackBtn: true,
      pageName: 'Thêm mới',
      breadcrumb: 'Thêm mới'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {
}


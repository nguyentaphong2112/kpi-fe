import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {ProductsIndexComponent} from "@app/modules/crm/pages/category-managers/products/products-index/products-index.component";
import {ProductsFormComponent} from "@app/modules/crm/pages/category-managers/products/products-form/products-form.component";
import {ProductsRoutingModule} from "@app/modules/crm/pages/category-managers/products/products.routing.module";

export function declaration() {
  return [ProductsIndexComponent, ProductsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, ProductsRoutingModule]
})
export class ProductsModule { }


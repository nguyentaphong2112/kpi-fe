import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'partners',
    loadChildren: () => import('../category-managers/partners/partners.module').then(m => m.PartnersModule)
  },
  {
    path: 'products',
    loadChildren: () => import('../category-managers/products/products.module').then(m => m.ProductsModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryManagersRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesRoutingModule } from './roles.routing.module';
import { RolesIndexComponent } from './roles-index/roles-index.component';
import { SharedModule } from '@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RolesFormComponent } from './roles-form/roles-form.component';
import { RolesMenuComponent } from './roles-menu/roles-menu.component';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzHighlightModule } from 'ng-zorro-antd/core/highlight';

@NgModule({
  declarations: [
    RolesIndexComponent,
    RolesFormComponent,
    RolesMenuComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    SharedModule,
    TranslateModule,
    NzTreeViewModule,
    NzHighlightModule
  ]
})
export class RolesModule {
}

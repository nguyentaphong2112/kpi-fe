import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralStatisticsIndexComponent } from '@app/modules/hrm/pages/model-plan/organizations/general-statistics-index/general-statistics-index.component';
import { GeneralStatisticsModelComponent } from '@app/modules/hrm/pages/model-plan/organizations/general-statistics-model/general-statistics-model.component';
import { OrganizationsFormComponent } from '@app/modules/hrm/pages/model-plan/organizations/organizations-form/organizations-form.component';
import { OrganizationsLayoutComponent } from '@app/modules/hrm/pages/model-plan/organizations/organizations-layout/organizations-layout.component';
import { PositionFormComponent } from '@app/modules/hrm/pages/model-plan/organizations/position-form/position-form.component';
import { PositionIndexComponent } from '@app/modules/hrm/pages/model-plan/organizations/position-index/position-index.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { OrganizationsHierarchyComponent } from '@app/modules/hrm/pages/model-plan/organizations/organizations-hierarchy/organizations-hierarchy.component';
import { OrganizationsRoutingModule } from '@app/modules/hrm/pages/model-plan/organizations/organizations.routing.module';

@NgModule({
  declarations: [
    GeneralStatisticsIndexComponent,
    GeneralStatisticsModelComponent,
    OrganizationsFormComponent,
    OrganizationsLayoutComponent,
    PositionFormComponent,
    PositionIndexComponent,
    OrganizationsHierarchyComponent
  ],
  imports: [
    CommonModule,
    OrganizationsRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class OrganizationsModule { }

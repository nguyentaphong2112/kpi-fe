import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@core/layout/layout.component';
import { AuthGuard } from '@core/services/guard/auth.guard';
import { AppInitService } from '@core/services/guard/app-init-data.service';
import { UnauthorizedComponent } from '@core/layout/unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./modules/feature.module').then((m) => m.FeatureModule),
    canActivate: [AuthGuard, AppInitService],
    // canActivateChild: [RoleGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

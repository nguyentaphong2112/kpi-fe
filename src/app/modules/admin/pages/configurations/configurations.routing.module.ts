import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'attribute',
    loadChildren: () => import('./attributes/attributes.module').then(m => m.AttributesModule)
  },
  {
    path: 'parameter',
    loadChildren: () => import('./parameters/parameters.module').then(m => m.ParametersModule)
  },
  {
    path: 'dynamic-report',
    loadChildren: () => import('./dynamic-reports/dynamic-reports.module').then(m => m.DynamicReportsModule)
  },
  {
    path: 'warning-configs',
    loadChildren: () => import('../configurations/warning-configs/warning-configs.module').then(m => m.WarningConfigsModule)
  },
  {
    path: 'config-pages',
    loadChildren: () => import('../configurations/config-pages/config-pages.module').then(m => m.ConfigPagesModule)
  },
  {
    path: 'config-charts',
    loadChildren: () => import('../configurations/config-charts/config-charts.module').then(m => m.ConfigChartsModule)
  },
  {
    path: 'mapping-values',
    loadChildren: () => import('../configurations/mapping-values/mapping-values.module').then(m => m.MappingValuesModule)
  },
  {
    path: 'config-mappings',
    loadChildren: () => import('../configurations/config-mappings/config-mappings.module').then(m => m.ConfigMappingsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationsRoutingModule { }

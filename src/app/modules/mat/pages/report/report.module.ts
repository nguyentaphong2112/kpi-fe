import { NgModule } from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {MrtIndexComponent} from '@app/modules/mat/pages/report/mrt-index/mrt-index.component';
import {ReportRoutingModule} from '@app/modules/mat/pages/report/report.routing.module';

export function declaration() {
  return [MrtIndexComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
    imports: [SharedModule, ReportRoutingModule]
})
export class ReportModule { }


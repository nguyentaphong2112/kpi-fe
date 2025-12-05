import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {SrsIndexComponent} from "@app/modules/hrm/pages/salary-manager/salary-reviews/srs-index/srs-index.component";
import {SrsFormComponent} from "@app/modules/hrm/pages/salary-manager/salary-reviews/srs-form/srs-form.component";
import {SalaryReviewsRoutingModule} from "@app/modules/hrm/pages/salary-manager/salary-reviews/salary-reviews.routing.module";

export function declaration() {
  return [SrsIndexComponent, SrsFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, SalaryReviewsRoutingModule]
})
export class SalaryReviewsModule { }


import { NgModule } from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {TkgIndexComponent} from "@app/modules/abs/pages/timekeeping-manager/timekeepings/tkg-index/tkg-index.component";
import {TkgFormComponent} from "@app/modules/abs/pages/timekeeping-manager/timekeepings/tkg-form/tkg-form.component";
import {TimekeepingsRoutingModule} from "@app/modules/abs/pages/timekeeping-manager/timekeepings/timekeepings.routing.module";

export function declaration() {
  return [TkgIndexComponent, TkgFormComponent];
}

@NgModule({
  declarations: declaration(),
  exports: declaration(),
  imports: [SharedModule, TimekeepingsRoutingModule]
})
export class TimekeepingsModule { }


import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from '@app/modules/dashboard/dashboard-routing.module';
import { GeneralInfoComponent } from '@app/modules/dashboard/pages/general-info/general-info.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SharedModule } from '@shared/shared.module';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  declarations: [GeneralInfoComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NzGridModule,
    NzCarouselModule,
    NzCardModule,
    NzSpinModule,
    SharedModule,
    SwiperModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule { }

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from '@app/modules/dashboard/dashboard-routing.module';
import {GeneralInfoComponent} from '@app/modules/dashboard/pages/general-info/general-info.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {NzCardModule} from 'ng-zorro-antd/card';
import {BannerInfoComponent} from './pages/user/banner-info/banner-info.component';
import { ArticleInfoComponent } from './pages/user/article-info/article-info.component';
import { ApplicationInfoComponent } from './pages/user/application-info/application-info.component';
import { PersonalInfoComponent } from './pages/user/personal-info/personal-info.component';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import { CalendarInfoComponent } from './pages/user/calendar-info/calendar-info.component';
import { SharedModule } from '@shared/shared.module';
import { DmrIndexComponent } from './pages/manager/dmr-index/dmr-index.component';
import { WarningInfoComponent } from './pages/manager/warning-info/warning-info.component';
import { ChartInfoComponent } from './pages/manager/chart-info/chart-info.component';
import { UserManualInfoComponent } from './pages/manager/user-manual-info/user-manual-info.component';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  declarations: [GeneralInfoComponent, BannerInfoComponent, ArticleInfoComponent, ApplicationInfoComponent, PersonalInfoComponent, CalendarInfoComponent,
    DmrIndexComponent, WarningInfoComponent, ChartInfoComponent, UserManualInfoComponent],
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

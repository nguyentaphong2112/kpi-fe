import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AwardInformationComponent } from '@app/modules/hrm/pages/staff-info/award-information/ain-index/award-information.component';

@NgModule({
    declarations: [AwardInformationComponent],
    exports: [
        AwardInformationComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class AwardInformationModule {
}

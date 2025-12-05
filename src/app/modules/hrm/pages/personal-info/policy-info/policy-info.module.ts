import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PioIndexComponent } from './pio-index/pio-index.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SharedModule } from '@shared/shared.module';
import { PioFormComponent } from './pio-form/pio-form.component';

@NgModule({
  declarations: [
    PioIndexComponent,
    PioFormComponent
  ],
  imports: [
    CommonModule,
    NzGridModule,
    SharedModule
  ]
})
export class PolicyInfoModule { }

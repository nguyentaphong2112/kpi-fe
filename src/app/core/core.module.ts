import { Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { UnauthorizedComponent } from './layout/unauthorized/unauthorized.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { BaseListComponent } from '@core/components/base-list.component';
import { BaseComponent } from '@core/components/base.component';
import { BaseFormComponent } from '@core/components/base-form.component';
import { SharedModule } from '@shared/shared.module';

const THIRD_MODULES = [SharedModule, CommonModule];
const COMPONENTS = [HeaderComponent, LayoutComponent, UnauthorizedComponent, NotFoundComponent, BaseListComponent, BaseComponent, BaseFormComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    ...THIRD_MODULES
  ],
    exports: [
        ...THIRD_MODULES, FormsModule, ReactiveFormsModule,
    ],
  providers: [
    Title
  ],
})
export class CoreModule {
}

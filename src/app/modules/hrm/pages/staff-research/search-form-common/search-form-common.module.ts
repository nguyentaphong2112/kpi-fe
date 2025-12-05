import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from './search-form/search-form.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    SearchFormComponent
  ],
  imports: [
      CommonModule,
      SharedModule
  ],
  exports: [SearchFormComponent]
})
export class SearchFormCommonModule { }

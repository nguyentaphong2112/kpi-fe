import { TagComponent } from './component/tag/tag.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WidthDirective } from './directive/width-directive';
import { modalDraggableDirective } from './directive/modal-drag.directive';
import { UppercaseInputDirective } from './directive/uppercase-input.directive';
import { HbtInputTextComponent } from './component/hbt-input-text/hbt-input-text.component';
import { HbtTextLabelComponent } from './component/hbt-text-label/hbt-text-label.component';
import { HbtInputCompactComponent } from './component/hbt-input-compact/hbt-input-compact.component';
import { HbtButtonComponent } from './component/hbt-button/hbt-button.component';
import { SelectAbleComponent } from './component/hbt-select-able/select-able.component';
import { MbCollapseComponent } from './component/hbt-collapse/hbt-collapse.component';
import { HbtScrollTabsComponent } from './component/hbt-scroll-tabs/hbt-scroll-tabs.component';
import { HbtDatePickerComponent } from './component/hbt-date-picker/hbt-date-picker.component';
import { HbtDataPickerComponent } from './component/hbt-data-picker/hbt-data-picker.component';
import { HbtSelectComponent } from './component/hbt-select/select.component';
import { NumberInputDirective } from './directive/number-input.directive';
import { InputTrimDirective } from './directive/input-trim.directive';
import { MaskDateDirective } from './directive/mask-date.directive';
import { VndFormatDirective } from './directive/vnd-format.directive';
import { UnsignedCharacterDirective } from './directive/unsigned-character.directive';
import { MaskRangeDateDirective } from './directive/mask-range-date.directive';
import { InputSpecialDirective } from './directive/input-special.directive';
import { SpecialInputDirective } from './directive/special-input.directive';
import { FormatCurrencyPipe } from './pipes/format-currency.pipe';
import { ImagePipe } from './pipes/image.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { DateFormatPipe } from './pipes/format-date.pipe';
import { FilterPipe } from './pipes/custom-filter.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { HighlightSearch } from './pipes/high-light.pipe';
import { EmployeeDataPickerComponent } from './component/employee-data-picker/employee-data-picker.component';
import { TreeDataPickerComponent } from './component/tree-data-picker/tree-data-picker.component';
import { TrimDirective } from './directive/trim-input.directive';
import { NumbericDirective } from './directive/numberic.directive';
import { HbtTableComponent } from './component/hbt-table/hbt-table.component';
import { HbtTableWrapComponent } from './component/hbt-table-wrap/hbt-table-wrap.component';
import { MapPipe } from './pipes/map.pipe';
import { TableFiledPipe } from './pipes/table-filed.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SwitchCasesDirective } from './directive/switch-case.directive';
import { HbtRangDatePickerComponent } from './component/hbt-rang-date-picker/hbt-rang-date-picker.component';
import {
  HbtNumbericRangeInputComponent
} from './component/hbt-numberic-range-input/hbt-numberic-range-input.component';
import { AlphabeticInputDirective } from './directive/alphabetic-input.directive';
import { HbtDateTimeWorkComponent } from './component/hbt-date-time-work/hbt-date-time-work.component';
import { NumberFilterPipe } from './pipes/number-filter.pipe';
import { HbtTimePickerComponent } from './component/hbt-time-picker/hbt-time-picker.component';
import { StatusPipe } from './pipes/status.pipe';
import { HbtUploadComponent } from './component/hbt-upload/hbt-upload.component';
import { BtnActionByIdComponent } from './component/btn-action-by-id/btn-action-by-id.component';
import { RejectCommonComponent } from './component/reject-common/reject-common.component';
import { BtnActionByListComponent } from './component/btn-action-by-list/btn-action-by-list.component';
import { EmpStatusCommonComponent } from './component/emp-status-common/emp-status-common.component';
import { ConvertArrayStringPipe } from '@core/utils/convert-array-string.pipe';
import { HbtImportFileComponent } from '@shared/component/hbt-import-file/hbt-import-file.component';
import { HbtTreeSelectComponent } from './component/hbt-tree-select/hbt-tree-select.component';
import { DeletePopupComponent } from '@shared/component/popup/delete-popup-component';
import { PopupService } from '@shared/component/popup/popup.service';
import { BtnMoreActionComponent } from '@shared/component/btn-more-action/btn-more-action.component';
import { HbtTreeViewComponent } from './component/hbt-tree-view/hbt-tree-view.component';
import { HbtInputTagComponent } from '@shared/component/hbt-input-tag/hbt-input-tag.component';
import {
  InputAttributeCommonComponent
} from '@shared/component/input-attribute-common/input-attribute-common.component';
import { ViewPdfModalComponent } from './component/view-pdf-modal/view-pdf-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HbtOrgTreeComponent } from './component/hbt-org-tree/hbt-org-tree.component';
import { PreviewFileComponent } from './component/preview-file/preview-file.component';
import { PreviewFileService } from '@shared/component/preview-file/preview-file.service';
import { ExtendFormItemComponent } from '@shared/component/extend-form-item/extend-form-item.component';
import { CategorySystemFormComponent } from './component/category-system-form/category-system-form.component';
import { AntDesignModule } from '@shared/ant-design.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { ScrollSpyDirective } from '@shared/directive/scroll-spy.directive';
import { MenuSearchComponent } from '@shared/component/menu-search/menu-search.component';
import { TopProgressBarComponent } from '@shared/component/top-progress-bar/top-progress-bar.component';
import { LoadingPageComponent } from '@shared/component/loading-page/loading-page.component';
import { AsyncCustomPipe } from '@shared/pipes/async-custom.pipe';
import { ExpressionDirective } from '@shared/directive/expression-input.directive';
import { HbtTableTreeComponent } from '@shared/component/hbt-table-tree/hbt-table-tree.component';
import { ConfirmComponent } from '@shared/component/popup/confirm-popup-component';
import { BtnMoreActionChildComponent } from '@shared/component/btn-more-action-child/btn-more-action-child.component';
import { HbtStepsComponent } from '@shared/component/hbt-steps/hbt-steps.component';

const PIPES = [
  ConvertArrayStringPipe, FormatCurrencyPipe, TruncatePipe, SafePipe,
  HighlightSearch, ImagePipe, FilterPipe, DateFormatPipe,
  MapPipe, TableFiledPipe, NumberFilterPipe, StatusPipe, AsyncCustomPipe
];
const COMPONENTS = [
  BtnMoreActionComponent, BtnMoreActionChildComponent, HbtImportFileComponent, TagComponent, TreeDataPickerComponent,
  HbtInputTextComponent, HbtDatePickerComponent, SelectAbleComponent, HbtButtonComponent,
  HbtTextLabelComponent, MbCollapseComponent, HbtScrollTabsComponent, HbtSelectComponent,
  HbtNumbericRangeInputComponent, HbtInputCompactComponent, HbtInputTagComponent,
  HbtDataPickerComponent, HbtRangDatePickerComponent, EmployeeDataPickerComponent,
  HbtTableComponent, HbtTableTreeComponent, HbtTableWrapComponent, HbtDateTimeWorkComponent, HbtTimePickerComponent,
  HbtUploadComponent, BtnActionByIdComponent, RejectCommonComponent, BtnActionByListComponent,
  EmpStatusCommonComponent, HbtTreeSelectComponent, DeletePopupComponent, HbtTreeViewComponent,
  InputAttributeCommonComponent, ViewPdfModalComponent, HbtOrgTreeComponent, ExtendFormItemComponent,
  CategorySystemFormComponent, PreviewFileComponent, MenuSearchComponent, TopProgressBarComponent,
  LoadingPageComponent, ConfirmComponent,HbtStepsComponent
];
const THIRD_MODULES = [TranslateModule, AntDesignModule];
const DIRECTIVE = [
  WidthDirective, modalDraggableDirective, UppercaseInputDirective, ScrollSpyDirective,
  NumberInputDirective, InputTrimDirective, InputSpecialDirective, VndFormatDirective,
  UnsignedCharacterDirective, MaskDateDirective, MaskRangeDateDirective, SpecialInputDirective,
  TrimDirective, NumbericDirective, SwitchCasesDirective, AlphabeticInputDirective, ExpressionDirective
];

const MODULES = [
  CommonModule,
  OverlayModule,
  PortalModule,
  ScrollingModule,
  DragDropModule,
  PdfViewerModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  TranslateModule,
  ToastrModule
];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVE, ...PIPES],
  imports: [
    ...MODULES,
    ...THIRD_MODULES,
  ],
  exports: [...MODULES, ...COMPONENTS, ...DIRECTIVE, ...PIPES, ...THIRD_MODULES],
  providers: [
    DecimalPipe,
    DatePipe,
    FormatCurrencyPipe,
    PopupService,
    PreviewFileService,
    Title,
    CookieService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class  SharedModule {
}

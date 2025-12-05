import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { vi } from 'date-fns/locale';
import { NZ_DATE_LOCALE } from 'ng-zorro-antd/i18n';
import { AppComponent } from './app.component';
import { FeatureModule } from './modules/feature.module';
import { CoreModule } from '@core/core.module';
import { AppInterceptor } from '@core/services/apis/app-interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IModuleTranslationOptions, ModuleTranslateLoader } from '@larscom/ngx-translate-module-loader';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';


// registerLocaleData(en);
export function translateLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export function ModuleHttpLoaderFactory(http: HttpClient) {
  const baseTranslateUrl = './assets/i18n';
  const options: IModuleTranslationOptions = {
    modules: [
      { baseTranslateUrl },
      { baseTranslateUrl, moduleName: 'dashboard', namespace: 'dashboard' },
      { baseTranslateUrl, moduleName: 'admin', namespace: 'admin' },
      { baseTranslateUrl, moduleName: 'hrm', namespace: 'hrm' },
      { baseTranslateUrl, moduleName: 'kpi', namespace: 'kpi' },
    ]
  };
  return new ModuleTranslateLoader(http, options);
}

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    FeatureModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: ModuleHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      //positionClass: 'toast-top-full-width'
    }),
  ],
  providers: [
    CookieService,
    { provide: NZ_DATE_LOCALE, useValue: vi },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  declarations: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}

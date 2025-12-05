import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss']
})
export class LoadingPageComponent implements OnInit {
  @HostBinding('class') hostClass = '';
  showLoadPage = false;

  constructor(private spinnerService: SpinnerService,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.spinnerService.getSpinnerObserver().subscribe(status => {
      this.showLoadPage = status === 'start';
      this.hostClass = this.showLoadPage ? 'app-loading-page' : '';
      this.cdRef.detectChanges();
    });
  }
}

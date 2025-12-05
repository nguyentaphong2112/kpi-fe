import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { FormGroup } from '@angular/forms';
import { Constant } from '@app/modules/exam/data-access/constants/constants';
import { doDownloadFileAttach } from '@app/modules/ptx/data-access/utils/utils';
import { SessionsService } from '@app/modules/exam/data-access/services/sessions-manager/sessions.service';

@Component({
  selector: 'app-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.scss']
})
export class ParticipantFormComponent extends BaseFormComponent<any> implements OnInit {
  urlDownload = Constant.URL_DOWNLOAD;
  @Input() form: FormGroup;
  @Input() isSubmitted = false;

  constructor(
    injector: Injector,
    private service: SessionsService
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  doDownloadFile() {
    this.service.downloadFile('/import-template-participant').toPromise();
  }
}

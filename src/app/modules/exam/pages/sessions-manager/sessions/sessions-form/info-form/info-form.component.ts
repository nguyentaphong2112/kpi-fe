import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseFormComponent } from '@core/components/base-form.component';
import { FormGroup } from '@angular/forms';
import { ExamPapersService } from '@app/modules/exam/data-access/services/exam-papers-manager/exam-papers.service';
import { HTTP_STATUS_CODE } from '@core/constant/system.constants';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.scss']
})
export class InfoFormComponent extends BaseFormComponent<any> implements OnInit {

  @Input() form: FormGroup;
  @Input() isSubmitted = false;

  listExamPaper = [];

  constructor(
    injector: Injector,
    private examPapersService: ExamPapersService
  ) {
    super(injector);
  }


  ngOnInit(): void {
    this.getListPaper();
    this.subscriptions.push(
      this.f.subjectCode.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        this.getListPaper();
      })
    );
    this.subscriptions.push(
      this.f.topicCode.valueChanges?.pipe(distinctUntilChanged()).subscribe(value => {
        this.getListPaper();
      })
    );
  }


  getListPaper() {
    if (!this.f['subjectCode'].value && !this.f['topicCode'].value) {
      this.f['examPaperIds'].setValue([]);
      this.listExamPaper = [];
      return;
    }
    const params = {
      subjectCode: this.f['subjectCode'].value,
      topicCode: this.f['topicCode'].value
    };
    this.examPapersService.getList(params, '/list', true).subscribe(res => {
      if (res.code === HTTP_STATUS_CODE.SUCCESS) {
        this.listExamPaper = res.data;
        const currentValues = this.f['examPaperIds'].value || [];
        const validIds = this.listExamPaper.map(it => it.examPaperId);
        const filteredValues = currentValues.filter(id => validIds.includes(id));
        this.f['examPaperIds'].setValue(filteredValues.length ? filteredValues : []);
      }
    });
  }

}

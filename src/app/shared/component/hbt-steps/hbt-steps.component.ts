import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

export interface IStep {
  stepCode: string;
  stepName: string;
  description?: string;
  timeAction?: string;
}

@Component({
  selector: 'hbt-steps',
  templateUrl: './hbt-steps.component.html',
  styleUrls: ['./hbt-steps.component.scss']
})
export class HbtStepsComponent implements OnInit, OnChanges {
  currentStep = 0;
  @Input() title: string;
  @Input() isSuccessAll: boolean;
  @Input() description: string;

  _steps: IStep[] = [];
  _currentStep: string;

  constructor() {}

  @Input()
  set stepConfig(config: { currentStep: string; steps: IStep[] } | any) {
    if (config.steps) {
      this._currentStep = config.currentStep;
      this._steps = config.steps;
      this.currentStep = this._steps.findIndex(el => el.stepCode.trim().toLowerCase() === this._currentStep?.trim().toLowerCase()) ?? 0;
    }
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.currentStep = this._steps?.findIndex(el => el.stepCode.trim().toLowerCase() === this._currentStep?.trim().toLowerCase()) ?? 0;
  }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { PanelOption } from './panel.config';
import { ComponentPortal } from '@angular/cdk/portal';
import { SessionService } from '@core/services/session.service';

@Component({
  selector: 'hbt-collapse',
  templateUrl: './hbt-collapse.component.html',
  styleUrls: ['./hbt-collapse.component.scss']
})
export class MbCollapseComponent implements OnInit {
  @Input() panels: PanelOption[] = [];
  @Input() extra?: TemplateRef<any> | null;
  @Output() activeChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private sessionService: SessionService) {
  }

  ngOnInit(): void {
    this.panels = [...this.panels.filter(element => this.sessionService.getSessionData(`FUNCTION_${element.code}`)?.view || true)];
    this.panels.forEach(panel => panel.panelComponentPortal = new ComponentPortal(panel.panelComponent));
  }

  setPanels(panels: any[]) {
    this.panels = panels;
    this.panels.forEach(panel => panel.panelComponentPortal = new ComponentPortal(panel.panelComponent));
  }

  addPanels(panels: any[]) {
    panels.forEach(panel => panel.panelComponentPortal = new ComponentPortal(panel.panelComponent));
    this.panels.push(...panels);
  }

  setReference(ref: any, id: any) {
    const panel = this.panels.find((item: PanelOption) => item.id === id);
    panel.componentRef = ref;
    panel.instance = ref.instance;
    panel.instance.data = panel.data;
    panel.instance.dataValid = panel.dataValid;
  }

  _activeChange($event) {
    this.activeChange.emit($event);
  }

  getInstance(panel: PanelOption) {
    return panel.instance;
  }
}

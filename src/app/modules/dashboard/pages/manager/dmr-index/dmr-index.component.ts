import { Component, OnInit } from '@angular/core';
import {ConfigChartsService} from "@app/modules/admin/data-access/services/configurations/config-charts.service";
import {ConfigChartsModel} from "@app/modules/admin/data-access/models/configurations/config-charts.model";

@Component({
  selector: 'app-dmr-index',
  templateUrl: './dmr-index.component.html',
  styleUrls: ['./dmr-index.component.scss']
})
export class DmrIndexComponent implements OnInit {
  arrChart:ConfigChartsModel[];

  constructor(
    private readonly service: ConfigChartsService
  ) { }

  ngOnInit(): void {
    this.service.getList(null, '/list').subscribe(res => {
      this.arrChart = res.data
    });
  }

}

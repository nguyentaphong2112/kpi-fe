import { Component, ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import threeD from 'highcharts/highcharts-3d';
import * as Highcharts from 'highcharts';
import { HttpParams } from '@angular/common/http';
import { Constant } from '@app/modules/hrm/data-access/constant/constant.class';
import { OrgService } from '@app/modules/hrm/data-access/services/model-plan/org.service';
import { GeneralStatisticsModelComponent } from '@app/modules/hrm/pages/model-plan/organizations/general-statistics-model/general-statistics-model.component';
import { BaseComponent } from '@core/components/base.component';
import { HTTP_STATUS_CODE, MICRO_SERVICE, SYSTEM_FORMAT_DATA } from '@app/core/constant/system.constants';
import { Utils } from '@core/utils/utils';
import { DataService } from '@shared/services/data.service';
import { UrlConstant } from '@app/modules/hrm/data-access/constant/url.class';
import { NzModalRef } from 'ng-zorro-antd/modal';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
threeD(Highcharts);

@Component({
  selector: 'app-general-statistics',
  templateUrl: './general-statistics-index.component.html',
  styleUrls: ['./general-statistics-index.component.scss']
})
export class GeneralStatisticsIndexComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() organizationId!: number;
  modalRef!: NzModalRef;
  constant = Constant;
  selectedButtons: boolean[] = [true, ...new Array(Constant.LABOR_STRUCTURE_CHART_LIST_TAG.length - 1).fill(false)];
  subs: Subscription[] = [];
  listChartTag = Constant.LABOR_STRUCTURE_CHART_LIST_TAG;
  chartBarId = 'chart-bar';
  typeValue = this.listChartTag[0].value;
  listDataChart = [];
  customTheme: any  = {
    colors: [
      '#058DC7', '#50B432', '#ED561B', '#DDDF00',
      '#24CBE5', '#a347fa', '#FCD9DF', '#e00b0b',
      '#FF9655', '#6AF9C4', '#d40bda', '#FF9999',
      '#8ff16e', '#5e3ead', '#dbb26b', '#918c79',
      '#f3e1a2', '#CFE0F8', '#c3eef5', '#916190',
      '#ff6699', '#c9c5af', '#b2b2e6', '#1d2e64',
      'rgba(232,64,64,0.42)', '#b9966a', '#6e6ed2', '#284821',
    ],
    title: {
      style: {
        color: '#000',
        font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
      }
    },
    subtitle: {
      style: {
        color: '#666666',
        font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
      }
    },
    legend: {
      itemStyle: {
        font: '9pt Trebuchet MS, Verdana, sans-serif',
        color: 'black'
      },
      itemHoverStyle: {
        color: 'gray'
      }
    }
  };
  dataChartBar = [];

  constructor(private orgService: OrgService,
              private el: ElementRef,
              private dataService: DataService,
              injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.organizationId) {
      this.getReportLaborStructure();
      this.getDataReport();
    }
  }

  createChartPie(data: NzSafeAny, index: number) {
    const chartIdName = this.chartBarId + index;
    const container = this.el.nativeElement.querySelector('#' + chartIdName);
    Highcharts.setOptions(this.customTheme);
    Highcharts.chart(container, {
      chart: {
        type: 'pie',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35
        }
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        headerFormat: `<span class="mb-2">{point.key}</span><br>`,
        pointFormat: '<span>Số lượng cán bộ: {point.y}</span>',
      },
      series: [{
        type: 'pie',
        name: 'Share',
        data,
      }],
    } as any);
  }

  createChartBar(categories: string[], data: NzSafeAny, subTitle: string, index: number) {
    const chartIdName = this.chartBarId + index;
    const container = this.el.nativeElement.querySelector('#' + chartIdName);
    const height = categories.length * 50 < 400 ? 400 : categories.length * 50;
    container.style.height = height  + 'px';
    Highcharts.setOptions(this.customTheme);

    Highcharts.chart(chartIdName, {
      chart: {
        type: 'bar',
        animation: {
          duration: 500
        },
        marginRight: 50,
        events: {
          click: () => this.onChartBarClick(),
        },
      },
      title: {
        align: 'left',
        text: ''
      },
      credits: {
        enabled: false,
      },
      subtitle: {
        useHTML: true,
        text: subTitle,
        floating: true,
        align: 'right',
        verticalAlign: 'middle',
        y: 100,
        x: 5
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories,
        labels: {
          formatter(nzData: NzSafeAny) {
            return nzData.value?.length > 20 ? nzData.value.substring(0, 20) + '...' : nzData.value;
          },
        },
      },
      yAxis: {
        opposite: true,
        tickPixelInterval: 150,
        title: {
          text: ''
        }
      },
      plotOptions: {
        bar: {
          pointWidth: 35
        },
        series: {
          colorByPoint: true,
          dataSorting: {
            enabled: true,
            matchByName: true
          },
          dataLabels: {
            enabled: true
          },
          point: {
            events: {
              click: () => this.onChartBarClick(),
            },
          },
        }
      },
      tooltip: {
        headerFormat: `<span class="mb-2">{point.key}</span><br>`,
        pointFormat: '<span>Số lượng cán bộ: {point.y}</span>',
      },
      series: [
        {
          data,
        },
      ],
    } as any);
  }

  createChartColumn(categories: NzSafeAny, data: NzSafeAny) {
    Highcharts.setOptions(this.customTheme);
    Highcharts.chart('chart-column', {
      chart: {
        type: 'column'
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'top'
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Người',
        },
        stackLabels: {
          enabled: true,
          format: '{total}', // Hiển thị tổng giá trị của từng cột
        },
      },
      xAxis: {
        categories
      },
      tooltip: {
        headerFormat: `<div><strong>{point.key}</strong></div>`,
        pointFormat: '<div><span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}</div>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          cursor: 'pointer',
          depth: 40,
          dataLabels: {
            enabled: true,
            format: '{point.y}', // Hiển thị giá trị của mỗi cột
          },
        },
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: data,
    } as NzSafeAny);
  }

  updateChartBar(data: NzSafeAny, dateStr: string, index: number) {
    data = data.sort((a: NzSafeAny, b: NzSafeAny) => b.total - a.total);
    const total = data.reduce((acc: number, item: NzSafeAny) => acc + item.total, 0);
    const subTitle = `<div class="highcharts-subtitle">
        <span style="font-size: 20px">Tháng: ${dateStr}</span><br>
        <span style="font-size: 18px">Tổng: <b>: ${total}</b></span>
      </div>`;
    const categories = data.map((item: NzSafeAny) => {
      const percent = total > 0 ? ((item.total * 100) / total).toFixed(2) : 0;
      item.percent = ': ' + percent + '%';
      return `${item.name}<span class="percent">${item.percent}</span>`;
    });
    const listValue = data.map((item: NzSafeAny) => item.total);
    this.createChartBar(categories, listValue, subTitle, index);
  }

  updateChartPie(data: NzSafeAny, index: number) {
    const total = data.reduce((acc: number, item: NzSafeAny) => acc + item.total, 0);
    const chartData = data.map((item: NzSafeAny) => {
      item.precent = (item.total * 100 / total).toFixed(2);
      item.name = item.name + ': ' + item.precent + '%';
      item.y = item.total;
      return item;
    });
    this.createChartPie(chartData, index);
  }

  onTagClick(value: string, index: number) {
    this.typeValue = value;
    this.setStatusButton(index);
  }

  setStatusButton(index: number) {
    this.selectedButtons = this.selectedButtons.map(() => false);
    this.selectedButtons[index] = true;
  }


  getReportLaborStructure() {
    const params = new HttpParams().set('organizationId', this.organizationId);
    this.subs.push(
      this.orgService.getReportLaborStructure(params).subscribe(res => {
        if (res.code === HTTP_STATUS_CODE.SUCCESS) {
          this.createChartColumn(res.data?.categories, res.data?.series)
        }
      })
    );
  }

  getDataReport() {
    this.listChartTag.forEach((data, index) => {
      const url = UrlConstant.ORGANIZATIONS.GET_CHART.replace("{chartType}", data.value);
      const params = {organizationId: this.organizationId};
      this.subscriptions.push(
        this.dataService.getDataByParam(url, params, MICRO_SERVICE.HRM, false).subscribe(res => {
          this.listDataChart[index] = res.data;
          if (index === 3) {
            this.dataChartBar = res.data;
            const lastIndex = this.dataChartBar.length >= 1 ? this.dataChartBar.length - 1 : 0;
            const dateStr = Utils.convertDateToSendServer(new Date(), SYSTEM_FORMAT_DATA.MONTH_TIME_FORMAT);
            this.updateChartBar(this.dataChartBar[lastIndex], dateStr, index);
          } else {
            this.updateChartPie(res?.data, index);
          }
        })
      );
    })
  }

  onChartBarClick() {
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: this.translate.instant('hrm.modelPlan.label.chartTitleByOrg'),
      nzContent: GeneralStatisticsModelComponent,
      nzComponentParams: {
        dataChartBar: this.dataChartBar
      },
      nzFooter: null
    });
  }

  ngOnDestroy(): void {
    this.subs?.forEach(sub => sub.unsubscribe());
    this.modalRef?.destroy();
  }
}

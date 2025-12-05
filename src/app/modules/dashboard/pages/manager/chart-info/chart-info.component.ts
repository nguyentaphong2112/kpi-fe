import {Component, ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {BaseComponent} from '@core/components/base.component';
import {Subscription} from 'rxjs';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {Constant} from '@app/modules/hrm/data-access/constant/constant.class';
import {OrgService} from '@app/modules/hrm/data-access/services/model-plan/org.service';
import {DataService} from '@shared/services/data.service';
import {NzSafeAny} from 'ng-zorro-antd/core/types';
import * as Highcharts from 'highcharts';
import {HttpParams} from '@angular/common/http';
import {HTTP_STATUS_CODE, MICRO_SERVICE, SYSTEM_FORMAT_DATA} from '@core/constant/system.constants';
import {UrlConstant} from '@app/modules/hrm/data-access/constant/url.class';
import {Utils} from '@core/utils/utils';
import {
  GeneralStatisticsModelComponent
} from '@app/modules/hrm/pages/model-plan/organizations/general-statistics-model/general-statistics-model.component';
import {ConfigChartsService} from "@app/modules/admin/data-access/services/configurations/config-charts.service";

@Component({
  selector: 'app-chart-info',
  templateUrl: './chart-info.component.html',
  styleUrls: ['./chart-info.component.scss']
})
export class ChartInfoComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() type: string;
  @Input() icon: string;
  @Input() title:string;
  @Input() organizationId = 1;
  @Input() configChartId:number;
  @Input() serviceName:string;
  @Input() url:string;
  @Input() color?:string;
  modalRef!: NzModalRef;
  constant = Constant;
  selectedButtons: boolean[] = [true, ...new Array(Constant.LABOR_STRUCTURE_CHART_LIST_TAG.length - 1).fill(false)];
  subs: Subscription[] = [];
  listChartTag = Constant.LABOR_STRUCTURE_CHART_LIST_TAG;
  chartBarId = 'chart-bar';
  chartPieId = 'chart-pie';
  chartColumnId = 'chart-column';
  chartLineId = 'chart-line';
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
              private configChartsService: ConfigChartsService,
              injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    // if (this.organizationId) {
    //   this.getReportLaborStructure();
    //   this.getDataReport();
    // }
    if(this.configChartId){
      this.getChartData()
    }
  }

  ngOnChanges() {
  }

  setChartColor(chartData,type = 'PIE') {
    if (!this.color || !chartData?.length) return;
    try {
      const labelColors = JSON.parse(this.color) as { [key: string]: string }[];

      const colorMap = new Map<string, string>();
      labelColors.forEach(item => {
        const label = Object.keys(item)[0];
        const color = item[label];
        colorMap.set(label, color);
      });
      if(type === 'PIE'){
          chartData = chartData.map((item: NzSafeAny) => {
          const color = colorMap.get(item.label);
          if (color) {
            item.color = color;
          }
          return item;
        });
      } else if (type === 'BAR') {
        chartData = chartData.map((array: NzSafeAny) => {
            return array.map((item:NzSafeAny)=>{
              const color = colorMap.get(item.name);
              if(color){
                item.color = color;
              }
              return item
            })
        });
      } else {
        chartData = chartData.map((item: NzSafeAny) => {
          const color = colorMap.get(item.name);
          if (color) {
            item.color = color;
          }
          return item;
        });
      }

    } catch (e) {

    }
  }

  createChartPie(data: NzSafeAny, index?: number) {
    const chartIdName = this.chartPieId;
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
          depth: 35,
          dataLabels:{
            enabled:false
          },
          showInLegend: true
        }
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
        verticalAlign: 'bottom'
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

  createChartBar(categories: string[], data: NzSafeAny, subTitle: string, index?: number) {
    const chartIdName = this.chartBarId;
    const container = this.el.nativeElement.querySelector('#' + chartIdName);
    const height = categories.length * 50 < 400 ? 400 : categories.length * 50;
    container.style.height = height  + 'px';
    Highcharts.setOptions(this.customTheme);

    Highcharts.chart(container, {
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
    const chartIdName = this.chartColumnId;
    const container = this.el.nativeElement.querySelector('#' + chartIdName);
    Highcharts.setOptions(this.customTheme);
    Highcharts.chart(container, {
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

  createChartLine(categories: NzSafeAny, data: NzSafeAny) {
    const chartIdName = this.chartLineId;
    const container = this.el.nativeElement.querySelector('#' + chartIdName);
    Highcharts.setOptions(this.customTheme);
    Highcharts.chart(container, {
      chart: {
        type: 'line'
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
        pointFormat: '<div><span style="color:{series.color}">\u25CF</span> {series.name}: {point.y}</div>',
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

  updateChartBar(data: NzSafeAny, dateStr: string, index?: number) {
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
    const listValue = data.map((item: NzSafeAny) => ({
      y: item.total,
      color: item.color,
      dataLabels: {
        enabled: true,
        color: item.color,
      },
    }));
    this.createChartBar(categories, listValue, subTitle, index);
  }

  updateChartPie(data: NzSafeAny, index?: number) {

    const total = data.reduce((acc: number, item: NzSafeAny) => acc + item.value, 0);
    const chartData = data.map((item: NzSafeAny) => {
      item.precent = (item.value * 100 / total).toFixed(2);
      item.name = item.label + ': ' + item.precent + '%';
      item.y = item.value;
      return item;
    });
    this.setChartColor(chartData);
    this.createChartPie(chartData, index);
  }

  updateChartColumn(data: NzSafeAny) {
    const categories = data.map(item => item.category.replace("-", "/"));

    const seriesMap: { [key: string]: number[] } = {};

    data.forEach(item => {
      item.series.forEach(seriesItem => {
        if (!seriesMap[seriesItem.label]) {
          seriesMap[seriesItem.label] = [];
        }
        seriesMap[seriesItem.label].push(seriesItem.value);
      });
    });

    const series = Object.keys(seriesMap).map(key => ({
      name: key,
      data: seriesMap[key]
    }));
    this.setChartColor(series,'COLUMN')
    this.createChartColumn(categories,series)
  }

  updateChartLine(data: NzSafeAny) {
    const categories = data.map(item => item.category.replace("-", "/"));

    const seriesMap: { [key: string]: number[] } = {};

    data.forEach(item => {
      item.series.forEach(seriesItem => {
        if (!seriesMap[seriesItem.label]) {
          seriesMap[seriesItem.label] = [];
        }
        seriesMap[seriesItem.label].push(seriesItem.value);
      });
    });

    const series = Object.keys(seriesMap).map(key => ({
      name: key,
      data: seriesMap[key]
    }));
    this.setChartColor(series,'LINE')
    this.createChartLine(categories,series)
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

  getChartData() {
    if (this.type === "PIE") {
      this.configChartsService.getChartData(this.configChartId, "", this.serviceName, this?.url).subscribe(res => {
          this.updateChartPie(res?.data)
        }
      )
    } else if (this.type === "COLUMN") {
      this.configChartsService.getChartData(this.configChartId, "", this.serviceName, this?.url).subscribe(res => {
          this.updateChartColumn(res?.data);
        }
      )
    } else if (this.type === "BAR") {
      this.configChartsService.getChartData(this.configChartId, "", this.serviceName, this?.url).subscribe(res => {
          this.dataChartBar = this.transformBarChartData(res?.data);
          const lastIndex = this.dataChartBar.length >= 1 ? this.dataChartBar.length - 1 : 0;
          const dateStr = Utils.convertDateToSendServer(new Date(), SYSTEM_FORMAT_DATA.MONTH_TIME_FORMAT);
          this.updateChartBar(this.dataChartBar[lastIndex], dateStr);
        }
      )

    } else if (this.type === "LINE") {
      this.configChartsService.getChartData(this.configChartId, "", this.serviceName, this?.url).subscribe(res => {
          this.updateChartLine(res?.data);
        }
      )
    }
  }

  transformBarChartData(data:NzSafeAny){
    let transformData = data.map(item =>
      item.series.map(seriesItem => ({
        name: seriesItem.label,
        total: seriesItem.value
      }))
    );
    this.setChartColor(transformData,'BAR');
    return transformData;
  }

  onChartBarClick() {
    this.modalRef = this.modal.create({
      nzWidth: window.innerWidth > 767 ? window.innerWidth / 1.5 > 1100 ? 1100 : window.innerWidth / 1.5 : window.innerWidth,
      nzTitle: this.title,
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

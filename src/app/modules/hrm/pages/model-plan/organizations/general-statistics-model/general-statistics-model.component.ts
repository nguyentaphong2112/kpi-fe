import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import threeD from 'highcharts/highcharts-3d';
import { format } from 'date-fns';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
threeD(Highcharts);

export interface DataChartBar {
  subTitle: string;
  listValue: number[];
  categories: string[];
}

@Component({
  selector: 'app-general-statistics-model',
  templateUrl: './general-statistics-model.component.html',
  styleUrls: ['./general-statistics-model.component.scss']
})
export class GeneralStatisticsModelComponent implements OnInit, AfterViewInit {
  barChart: NzSafeAny;
  sequenceTimer = 0;
  dataChartBar = [];
  maxRange =  0;

  constructor(private el: ElementRef,
              private modalService: NzModalService) { }

  ngOnInit(): void {
    this.maxRange = this.dataChartBar.length - 1
  }

  ngAfterViewInit() {
    const dateStr = this.getMonthByDuration(this.maxRange);
    const initData = this.convertDataChartBar(this.dataChartBar[0], dateStr);
    this.createChartBar(initData);
  }

  createChartBar(data: DataChartBar) {
    if (data) {
      const container = this.el.nativeElement.querySelector('#chart_bar');
      const height = data?.categories.length * 50 < 400 ? 400 : data?.categories.length * 50;
      container.style.height = height  + 'px';
      // Highcharts.setOptions(this.customTheme);

      this.barChart = Highcharts.chart(container, {
        chart: {
          type: 'bar',
          animation: {
            duration: 500
          },
          marginRight: 50,

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
          text: data.subTitle,
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
          categories: data.categories,
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
          }
        },
        tooltip: {
          headerFormat: `<span class="mb-2">{point.key}</span><br>`,
          pointFormat: '<span>Số lượng cán bộ: {point.y}</span>',
        },
        series: [
          {
            data: data.listValue,
          },
        ],
      } as any);
    }
  }

  convertDataChartBar(data: NzSafeAny, dateStr: string): DataChartBar {
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
    return {categories, listValue, subTitle};
  }

  playOrPauseRange() {
    if (this.barChart.sequenceTimer) {
      this.pauseRange();
    } else {
      this.playRange();
    }
  }

  playRange() {
    const button = this.el.nativeElement.querySelector('#play-pause-button');
    button.title = 'pause';
    button.className = 'fa fa-pause';
    this.barChart.sequenceTimer = setInterval( () => {
      this.updateRange();
    }, 800);
  }

  updateRange() {
    this.sequenceTimer += 1;
    if (this.sequenceTimer >= this.maxRange) {
      this.pauseRange();
    }
    this.updateChartBar(this.sequenceTimer);
  }

  updateChartBar(sequenceTime: number) {
    const durationMonth = this.maxRange - sequenceTime;
    const dateStr = this.getMonthByDuration(durationMonth);
    const data = this.convertDataChartBar(this.dataChartBar[sequenceTime], dateStr);

    this.barChart.update({
      subtitle: {
        useHTML: true,
        text: data?.subTitle,
        floating: true,
        align: 'right',
        verticalAlign: 'middle',
        y: 100,
        x: 5
      },
      xAxis: {
        categories: data?.categories,
        labels: {
          formatter(nzData: NzSafeAny) {
            return nzData.value?.length > 20 ? nzData.value.substring(0, 20) + '...' : nzData.value;
          },
        },
      },
      series: [
        {
          data: data?.listValue,
        },
      ],
    });
  }

  pauseRange() {
    const button = this.el.nativeElement.querySelector('#play-pause-button');
    button.title = 'play';
    button.className = 'fa fa-play';
    clearTimeout(this.barChart.sequenceTimer);
    this.barChart.sequenceTimer = undefined;
  }

  getMonthByDuration(durationMonth: number): string {
    const currentDate = new Date();
    const fromDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - durationMonth,
      1
    );
    return format(fromDate, 'MM/yyyy');
  }

  changeSequenceTimer(sequenceTime: number) {
    this.updateChartBar(sequenceTime);
  }

  closeModal() {
    this.modalService.closeAll();
  }

}


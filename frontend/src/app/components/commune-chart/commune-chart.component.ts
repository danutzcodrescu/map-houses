import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import { of, Observable, Subject } from 'rxjs';
import ApexCharts from 'apexcharts';

const ZIPCODE = gql`
  {
    zip @client
  }
`;

const GET_COMMUNE_DATA = gql`
  query GetCommuneData($zipCode: Int!) {
    getCommuneStatistics(zipCode: $zipCode) {
      dailyAverage {
        avg_price
        date
      }
      onMarketAvg
    }
  }
`;

@Component({
  selector: 'app-commune-chart',
  templateUrl: './commune-chart.component.html',
  styleUrls: ['./commune-chart.component.scss']
})
export class CommuneChartComponent implements OnInit, OnDestroy {
  communeData$: Observable<any>;

  @ViewChild('chart')
  chart: ElementRef;

  private unsubscribe$ = new Subject();

  private options = {
    chart: {
      type: 'area',
      width: '99%',
      height: '300px',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      line: {
        curve: 'smooth'
      }
    },

    markers: {
      style: 'inverted',
      size: 6
    },

    title: {
      text: 'Price average history per commune',
      align: 'center',
      style: {
        fontWeight: 'bold',
        fontSize: '18px'
      }
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      shared: false,
      title: 'Avg price: ',
      y: {
        formatter: function(val) {
          return `${val.toFixed(0)} euro`;
        }
      }
    }
  };

  private chartInstance: any;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.chartInstance = new ApexCharts(this.chart.nativeElement, {
      ...this.options,
      series: [
        {
          name: 'prices',
          data: []
        }
      ]
    });

    this.chartInstance.render();

    this.communeData$ = this.apollo
      .watchQuery({
        query: ZIPCODE
      })
      .valueChanges.pipe(
        map((resp: any) => {
          if (!resp.data) {
            return NaN;
          }
          return parseInt(resp.data.zip, 10);
        }),
        switchMap(zipCode => {
          if (zipCode && zipCode !== NaN) {
            return this.apollo.query({
              query: GET_COMMUNE_DATA,
              variables: {
                zipCode
              }
            });
          }
          return of({
            data: { getCommuneStatistics: { onMarketAvg: 0, dailyAverage: [] } }
          }) as any;
        }),
        map((resp: any) => resp.data.getCommuneStatistics)
      );
    this.communeData$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data.dailyAverage.length) {
        const updates = data.dailyAverage
          .sort((a, b) => {
            if (a.date > b.date) {
              return 1;
            }
            if (a.date < b.date) {
              return -1;
            }
          })
          .map(price => [parseInt(price.date, 10), price.avg_price]);
        this.chartInstance.updateSeries([{ data: updates }]);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import * as ApexCharts from 'apexcharts';

const SELECTED_HOUSE_MUTATION = gql`
  mutation SelectedHouse {
    selectedHouse(externalId: null) @client
  }
`;

const SELECTED_HOUSE = gql`
  {
    selectedHouse @client
  }
`;

const GET_HOUSE_DATA = gql`
  query GetHouseData($externalId: ID!) {
    getHouseData(externalId: $externalId) {
      surface
      price
      url
      rooms
      prices {
        price
        createdAt
      }
    }
  }
`;

@Component({
  selector: 'app-selected-house',
  templateUrl: './selected-house.component.html',
  styleUrls: ['./selected-house.component.scss']
})
export class SelectedHouseComponent implements OnInit, OnDestroy {
  house$: Observable<ApolloQueryResult<any>>;
  @ViewChild('chart')
  chart: ElementRef;

  private unsubscribe$ = new Subject();

  private options = {
    chart: {
      type: 'bar',
      width: '100%'
    },

    dataLabels: {
      enabled: false
    },
    title: {
      text: 'Price history',
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
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.house$ = this.apollo
      .query({
        query: SELECTED_HOUSE
      })
      .pipe(
        map((resp: any) => resp.data.selectedHouse),
        switchMap(selected =>
          this.apollo.query({
            query: GET_HOUSE_DATA,
            variables: { externalId: selected }
          })
        ),
        map((resp: any) => resp.data.getHouseData)
      );

    this.house$.pipe(takeUntil(this.unsubscribe$)).subscribe((house: any) => {
      const chart = new ApexCharts(this.chart.nativeElement, {
        ...this.options,
        series: [
          {
            name: 'prices',
            data: house.prices.map(price => [
              parseInt(price.createdAt, 10),
              price.price
            ])
          }
        ]
      });

      chart.render();
    });
  }

  back() {
    this.apollo
      .mutate({ mutation: SELECTED_HOUSE_MUTATION })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

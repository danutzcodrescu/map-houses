import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { map, switchMap } from 'rxjs/operators';
import ApexCharts from 'apexcharts';

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
export class SelectedHouseComponent implements OnInit {
  house$: Observable<ApolloQueryResult<any>>;
  @ViewChild('chart')
  chart: ElementRef;

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

    this.house$.subscribe((house: any) => {
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
        ],
        xaxis: {
          type: 'datetime'
        }
      });

      chart.render();
    });
  }

  back() {
    this.apollo.mutate({ mutation: SELECTED_HOUSE_MUTATION }).subscribe();
  }
}

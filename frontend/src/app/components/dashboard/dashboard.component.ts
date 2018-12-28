import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApolloQueryResult } from 'apollo-client';
import * as _ from 'lodash';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

const DASHBOARD_STATUS = gql`
  {
    isDashboardOpen @client
  }
`;

const TOGGLE_DASHBOARD = gql`
  mutation ToggleDashboard {
    toggleDashboard @client
  }
`;

const ZIPCODE = gql`
  {
    zip @client
  }
`;

const SELECTED_HOUSE = gql`
  {
    selectedHouse @client
  }
`;

const PRICE_RANGE = gql`
  {
    priceRange @client {
      min
      max
    }
  }
`;

const GET_HOUSES_PER_ZIPCODE = gql`
  query GetHousesPerZip($zipCode: Int!, $min: Int, $max: Int) {
    getHousesPerZipCode(zipCode: $zipCode, min: $min, max: $max) {
      price
      rooms
      surface
      url
      externalId
    }
  }
`;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isDashboardOpen$: Observable<ApolloQueryResult<boolean>>;
  zipCode$: Observable<number>;
  selectedHouse$: Observable<ApolloQueryResult<string>>;
  priceRange$: Observable<{ min: number; max: number }>;
  dataSource: Observable<any[]>;
  priceRange: { min: number; max: number };

  constructor(private apollo: Apollo, private local: LocalStorageService) {
    this.priceRange = local.get<{ min: number; max: number }>('priceRange');
  }

  ngOnInit() {
    this.selectedHouse$ = this.apollo
      .watchQuery<string>({ query: SELECTED_HOUSE })
      .valueChanges.pipe(map((result: any) => result.data.selectedHouse));
    this.zipCode$ = this.apollo
      .watchQuery<number>({ query: ZIPCODE })
      .valueChanges.pipe(map((result: any) => parseInt(result.data.zip, 10)));
    this.isDashboardOpen$ = this.apollo
      .watchQuery<boolean>({ query: DASHBOARD_STATUS })
      .valueChanges.pipe(map(result => (result.data as any).isDashboardOpen));
    this.priceRange$ = this.apollo
      .watchQuery<{ min: number; max: number }>({ query: PRICE_RANGE })
      .valueChanges.pipe(map((result: any) => result.data.priceRange));
    this.dataSource = combineLatest(
      this.selectedHouse$,
      this.isDashboardOpen$,
      this.zipCode$,
      this.priceRange$
    ).pipe(
      switchMap(([selectedHouse, isDashboardOpen, zipCode, priceRange]) => {
        if (
          !selectedHouse &&
          isDashboardOpen &&
          !_.isNaN(zipCode) &&
          this.priceRange !== priceRange &&
          isDashboardOpen &&
          !_.isNaN(zipCode)
        ) {
          this.priceRange = priceRange;
          return this.apollo.query<any[]>({
            query: GET_HOUSES_PER_ZIPCODE,
            variables: { zipCode, min: priceRange.min, max: priceRange.max }
          });
        }
        return of({ data: { getHousesPerZipCode: [] } }) as any;
      }),
      map((result: any) => result.data.getHousesPerZipCode)
    );
  }

  toggleDashboard() {
    this.apollo
      .mutate({
        mutation: TOGGLE_DASHBOARD
      })
      .subscribe();
  }
}

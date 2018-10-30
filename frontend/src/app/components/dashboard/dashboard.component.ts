import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApolloQueryResult } from 'apollo-client';
import * as _ from 'lodash';

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

const GET_HOUSES_PER_ZIPCODE = gql`
  query GetHousesPerZip($zipCode: Int!) {
    getHousesPerZipCode(zipCode: $zipCode) {
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
  private zipCode$: Observable<number>;
  selectedHouse$: Observable<ApolloQueryResult<string>>;
  dataSource: Observable<any[]>;

  constructor(private apollo: Apollo) {}

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
    this.dataSource = combineLatest(
      this.selectedHouse$,
      this.isDashboardOpen$,
      this.zipCode$
    ).pipe(
      switchMap(([selectedHouse, isDashboardOpen, zipCode]) => {
        if (!selectedHouse && isDashboardOpen && !_.isNaN(zipCode)) {
          return this.apollo.query<any[]>({
            query: GET_HOUSES_PER_ZIPCODE,
            variables: { zipCode }
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

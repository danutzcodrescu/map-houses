import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';

const SELECTED_HOUSE = gql`
  mutation SelectedHouse($externalId: string!) {
    selectedHouse(externalId: $externalId) @client
  }
`;

@Component({
  selector: 'app-house-table',
  templateUrl: './house-table.component.html',
  styleUrls: ['./house-table.component.scss']
})
export class HouseTableComponent implements OnDestroy {
  @Input()
  dataSource: any[];

  displayedColumns = ['price', 'rooms', 'surface', 'url'];

  private mutation: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnDestroy() {
    this.mutation.unsubscribe();
  }

  getRecord(row: any) {
    this.mutation = this.apollo
      .mutate({
        mutation: SELECTED_HOUSE,
        variables: {
          externalId: row.externalId
        }
      })
      .subscribe();
  }
}

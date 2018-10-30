import { Component, OnInit, Input } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

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
export class HouseTableComponent implements OnInit {
  @Input()
  dataSource: any[];

  displayedColumns = ['price', 'rooms', 'surface', 'url'];

  constructor(private apollo: Apollo) {}

  ngOnInit() {}

  getRecord(row: any) {
    this.apollo
      .mutate({
        mutation: SELECTED_HOUSE,
        variables: {
          externalId: row.externalId
        }
      })
      .subscribe();
  }
}

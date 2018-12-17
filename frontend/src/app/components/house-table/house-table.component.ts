import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Subscription, of } from 'rxjs';
import { Sort } from '@angular/material';

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
export class HouseTableComponent implements OnDestroy, OnChanges {
  @Input()
  dataSource: any[];

  data = of([]);

  displayedColumns = ['price', 'rooms', 'surface', 'url'];

  private mutation: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnDestroy() {
    this.mutation.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (
      Array.isArray(changes.dataSource.currentValue) &&
      changes.dataSource.currentValue !== changes.dataSource.previousValue
    ) {
      this.data = of(changes.dataSource.currentValue);
    }
  }

  sortData(event: Sort) {
    const collator = new Intl.Collator(undefined, { numeric: true });
    const sorted = this.dataSource.sort((a, b) =>
      collator.compare(a[event.active], b[event.active])
    );
    if (event.direction === 'desc') {
      this.data = of(sorted.reverse());
    } else {
      this.data = of(sorted);
    }
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

import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { MapService, GetRegions } from "src/app/services/map/map.service";
import gql from "graphql-tag";
import { Apollo } from "apollo-angular";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

const GET_REGIONS = gql`
  query getRegions {
    getRegions {
      zipCode
      houses
    }
  }
`;

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild("map")
  mapElement: ElementRef;

  private unsubscribe$ = new Subject();

  constructor(private map: MapService, private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .query<{ getRegions: GetRegions[] }>({
        query: GET_REGIONS
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(val => {
        this.map.addPoligons(val.data.getRegions);
      });
    this.map.createMap(this.mapElement.nativeElement);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

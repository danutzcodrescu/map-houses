import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MapService, GetRegions } from 'src/app/services/map/map.service';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

const GET_REGIONS = gql`
  query getRegions {
    getRegions {
      zipCode
      houses
    }
  }
`;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('map')
  mapElement: ElementRef;

  constructor(private map: MapService, private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .query<{ getRegions: GetRegions[] }>({
        query: GET_REGIONS
      })
      .subscribe(val => {
        this.map.addPoligons(val.data.getRegions);
      });
    this.map.createMap(this.mapElement.nativeElement);
  }
}

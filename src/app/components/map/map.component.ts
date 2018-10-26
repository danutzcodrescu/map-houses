import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('map')
  mapElement: ElementRef;

  constructor(private map: MapService, private apollo: Apollo) {
    this.map = map;
  }

  ngOnInit() {
    this.apollo
      .query({
        query: gql`
          query getRegions {
            getRegions {
              zipCode
              houses
            }
          }
        `
      })
      .subscribe(val => console.log(val));
    this.map.createMap(this.mapElement.nativeElement);
    this.map.addPoligons();
  }
}

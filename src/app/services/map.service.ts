import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { environment } from '../../environments/environment';
import * as communities from '../../assets/belgium.zips.json';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: L.Map;
  private _polygons: L.GeoJSON<any>;
  constructor() {}

  createMap(id: string) {
    this.map = L.map(id).setView([50.5039, 4.4699], 13);
    L.tileLayer(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        attribution:
          // tslint:disable-next-line:max-line-length
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: environment.mapbox
      }
    ).addTo(this.map);
  }

  addPoligons() {
    this._polygons = L.geoJSON((communities as any).default, {
      style: {
        fillColor: '#5A5A5A',
        weight: 2,
        opacity: 0.4,
        color: '#5A5A5A',
        dashArray: '3',
        fillOpacity: 0.2
      } as any
    }).addTo(this.map);
    this.map.fitBounds(this._polygons.getBounds());
  }
}

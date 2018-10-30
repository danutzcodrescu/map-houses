import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { environment } from '../../../environments/environment';
import * as communities from '../../../assets/belgium.zips.json';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import * as turf from '@turf/turf';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import * as _ from 'lodash';

export interface GetRegions {
  houses: number;
  zipCode: number;
}

const CHANGE_ZIPCODE = gql`
  mutation ChangeCommune($zip: Int!) {
    changeCommune(zip: $zip) @client
  }
`;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: L.Map;
  private _polygons: L.GeoJSON<any>;
  private _housesPerCommune = L.geoJSON(null, {
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, {
        icon: L.divIcon({
          iconSize: [50, 50],
          iconAnchor: [25, 50],
          className: 'postcard-marker',
          html: `<div class="oval">${feature.properties.houses}</div>`
        })
      });
    }
  });
  private _markerCluster = (L as any).markerClusterGroup({
    showCoverageOnHover: false,
    iconCreateFunction: function(cluster) {
      const sum = (cluster.getAllChildMarkers() as any[]).reduce(
        (acc, current) => acc + current.feature.properties.houses,
        0
      );
      return L.divIcon({
        html: `<div>${sum}</div>`,
        className: 'marker-cluster'
      });
    }
  });

  constructor(private apollo: Apollo) {}

  createMap(id: string) {
    this.map = L.map(id, { maxZoom: 18, minZoom: 10, zoomControl: false });
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
    this.map.addLayer(this._markerCluster);
  }

  addPoligons(regions: GetRegions[]) {
    const zipCodes = _.keyBy(regions, 'zipCode');
    this._polygons = L.geoJSON((communities as any).default, {
      style: {
        fillColor: '#5A5A5A',
        weight: 2,
        opacity: 0.4,
        color: '#5A5A5A',
        dashArray: '3',
        fillOpacity: 0.2
      } as any,
      filter: feature => Object.keys(zipCodes).includes(feature.properties.zip),
      onEachFeature: (feature, layer) => {
        layer.on({
          click: () => {
            this.apollo
              .mutate({
                mutation: CHANGE_ZIPCODE,
                variables: {
                  zip: feature.properties.zip
                }
              })
              .subscribe();
          }
        });
      }
    }).addTo(this.map);
    const points = this._polygons.getLayers().map(layer => {
      const center: L.LatLng = (layer as any).getBounds().getCenter();
      return turf.point([center.lng, center.lat], {
        zipCode: (layer as any).zipCode,
        houses: zipCodes[(layer as any).feature.properties.zip].houses
      });
    });

    this.map.setMaxBounds(this._polygons.getBounds());
    this._housesPerCommune.addData(points as any);
    this._markerCluster.addLayer(this._housesPerCommune);
    this.map.fitBounds(this._polygons.getBounds());
  }
}

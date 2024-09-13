import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor() {}
  private latitude: number | any;
  private longitude: number | any;

  public async ngOnInit() {

    const position = await Geolocation.getCurrentPosition();
    this.longitude = position.coords.longitude;
    this.latitude = position.coords.latitude;
    // this.longitude = 110.29279324661982;
    // this.latitude = -8.010504382664715;

    const map = new Map({
      basemap: "topo-vector"
    });

    const view = new MapView({
      container: "container",
      map:map,
      zoom: 19,
      center: [this.longitude, this.latitude]
    });

    // Create a Point geometry
    const point = new Point({
      longitude: this.longitude,
      latitude: this.latitude
    });

    const markerSymbol = {
      type: 'simple-marker',
      color: [226, 119, 40], // Orange color
      outline: {
        color: [255, 255, 255], // White color
        width: 1
      }
    };

    // Create a graphic using the point geometry and marker symbol
    const pointGraphic = new Graphic({
      geometry: point, // Use Point geometry here
      symbol: markerSymbol
    });

    // Add the graphic to the view
    view.graphics.add(pointGraphic);
  }
}

import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  map: Map | any;

  constructor() {}

  async ngOnInit() {
    this.initializeMap('topo-vector'); // default basemap

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  initializeMap(basemap: string) {
    this.map = new Map({
      basemap: basemap,
    });

    this.mapView = new MapView({
      container: 'container',
      map: this.map,
      zoom: 8,
    });

    const weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    this.map.add(weatherServiceFL);
  }

  onBasemapChange(event: any) {
    const selectedBasemap = event.target.value;
    this.map.basemap = selectedBasemap; // dynamically change basemap
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      }, reject);
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });

    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        geometry: geom,
        symbol: new SimpleMarkerSymbol({
          color: [226, 119, 40], // warna marker pengguna
          outline: { // outline marker pengguna
            color: [255, 255, 255],
            width: 2
          }
        }),
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }

    // Menambahkan marker di lokasi tertentu (Williams Lake)
    const washingtonDC = new Point({ latitude: 52.190299055651685, longitude: -122.06770883384416 });
    const dcMarker = new Graphic({
      geometry: washingtonDC,
      symbol: new SimpleMarkerSymbol({
        color: [0, 0, 255], // warna marker biru
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      }),
    });
    this.mapView.graphics.add(dcMarker);
  }
}

const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';

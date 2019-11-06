import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.css']
})
export class GooglemapsComponent implements OnInit, AfterViewInit {

  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;
  raster: OlTileLayer;


  constructor() { }

  ngOnInit() {
    this.initializeMap();
  }

  addInteraction() {}

  private initializeMap() {
    this.source = new OlXYZ({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png'
      // url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    });

    this.raster = new OlTileLayer({
      source: new OlXYZ()
    });

    this.layer = new OlTileLayer({
      source: this.source
    });

    this.view = new OlView ({
      center: fromLonLat([4.897070, 52.377956]),
      zoom: 7
    });

    this.map = new OlMap({
      target: 'map',
      layers: [this.layer, this.raster],
      view: this.view
    });
  }

  ngAfterViewInit() {
    this.map.setTarget('map');
  }
}

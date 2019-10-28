import { Component, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { TouchSequence } from 'selenium-webdriver';
import { OSM } from 'ol/source';

@Component({
  selector: 'app-map-view-bing',
  templateUrl: './map-view-bing.component.html',
  styleUrls: ['./map-view-bing.component.css']
})
export class MapViewBingComponent implements OnInit {

  private map: Map;

  constructor() { }

  ngOnInit() {
    this.initializeMap();
  }
  private initializeMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
  }

}

import { Component, OnInit } from '@angular/core';


import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM, {ATTRIBUTION} from 'ol/source/OSM';



@Component({
  selector: 'app-map-view-open-street',
  templateUrl: './map-view-open-street.component.html',
  styleUrls: ['./map-view-open-street.component.css']
})
export class MapViewOpenStreetComponent implements OnInit {

  private map: Map;

  openCycleMapLayer = new TileLayer({
    source: new OSM ({
      attributions: [
        'All maps © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>',
        ATTRIBUTION
      ],
      url: 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
        '?apikey=Your API key from http://www.thunderforest.com/docs/apikeys/ here'
    })
  });

  openSeaMapLayer = new TileLayer({
    source: new OSM ({
      attributions: [
        'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
        ATTRIBUTION
      ],
      opaque: false,
      url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
    })
  });

  constructor() { }

  ngOnInit() {
    this.initializeMap();
  }



  private initializeMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.openCycleMapLayer,
        this.openSeaMapLayer
      ],
      view: new View({
        center: [0, 0],
        // center: [-244780.24508882355, 5986452.183179816],
        // projection: 'EPSG:4326',
        zoom: 0
      })
    });
  }


}

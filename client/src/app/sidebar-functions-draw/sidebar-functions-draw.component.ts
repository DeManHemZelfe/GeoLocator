import { Component, OnInit } from '@angular/core';

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Draw from 'ol/interaction/Draw';
import { OSM, Vector as VectorSource } from 'ol/source';
import Point from 'ol/geom/Point';
import { Icon, Stroke, Style, Fill } from 'ol/style';
import OlDraw from 'ol/interaction/Draw';
import { ATTRIBUTION } from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import LineString from 'ol/geom/LineString';
import GeometryType from 'ol/geom/GeometryType';
import { FormControl } from '@angular/forms';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar-functions-draw.component.html',
  styleUrls: ['./sidebar-functions-draw.component.css']
})
export class SidebarFunctionsDrawComponent implements OnInit {
  disableSelect = new FormControl(false);
  panelOpenState = false;
  typeSelect = new FormControl('');

  private map: Map;
  private draw: OlDraw;

  raster = new TileLayer({
    source: new OSM()
  });

  source = new VectorSource({wrapX: false});

  vector = new VectorLayer({
    source: this.source,
    style: new Style({
      fill: new Fill({
        color: 'lightgreen',
      }),
      stroke: new Stroke({
        color: 'black',
        width: 3
      }),
    })
  });

  // openCycleMapLayer = new TileLayer({
  //   source: new OSM({
  //     attributions: [
  //       'All maps © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>',
  //       ATTRIBUTION
  //     ],
  //     url:
  //       'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
  //       '?apikey=Your API key from http://www.thunderforest.com/docs/apikeys/ here'
  //   })
  // });

  // openSeaMapLayer = new TileLayer({
  //   source: new OSM({
  //     attributions: [
  //       'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
  //       ATTRIBUTION
  //     ],
  //     opaque: false,
  //     url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
  //   })
  // });

  constructor() {}

  ngOnInit() {
    this.initializeMap();
    this.addInteraction();
  }

  addInteraction() {
    console.log('addInteraction()');
    const value = this.typeSelect.value;
    if (value !== '') {
      this.draw = new OlDraw({
        source: this.source,
        type: this.typeSelect.value,
      });
      this.map.addInteraction(this.draw);
    }
  }

  switchMode() {
    console.log('switchMode()');
    this.map.removeInteraction(this.draw);
    this.addInteraction();
  }

  initializeMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        this.raster,
        this.vector
      ],
      view: new View({
        center: fromLonLat([4.89707, 52.377956]),
        // center: fromLonLat[this.locations],
        // center: [-244780.24508882355, 5986452.183179816],
        // projection: 'EPSG:4326',
        zoom: 7,
      })
    });
  }
}

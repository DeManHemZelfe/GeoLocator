import { Component, OnInit } from '@angular/core';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import WMTS from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { Tile } from 'openlayers';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  private map: Map;

  private projectionExtent = [-285401.92, 22598.08, 595401.92, 903401.92];
  private projection = new Projection({ code: 'EPSG:28992', units: 'm', extent: this.projectionExtent });

  private resolutions = [
    3440.640,
    1720.320,
    860.160,
    430.080,
    215.040,
    107.520,
    53.750,
    26.880,
    13.440,
    6.720,
    3.360,
    1.680,
    0.840,
    0.420,
    0.210
  ];
  private matrixIds = new Array(15);

  private layers = {
    brt: 'brtachtergrondkaart',
    brtGrijs: 'brtachtergrondkaartgrijs',
    brtPastel: 'brtachtergrondkaartpastel',
    brtWater: 'brtachtergrondkaartwater',
  }

  constructor() { }

  ngOnInit() {
    this.initializeMap();
  }

  private initializeMap() {

    for (let i = 0; i < this.matrixIds.length; i++) {
      this.matrixIds[i] = 'EPSG:28992:' + i;
    }

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          opacity: 0.7,
          source: new WMTS({
            attributions: 'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
            url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
            layer: this.layers.brt,
            matrixSet: 'EPSG:28992',
            format: 'image/png',
            projection: this.projection,
            tileGrid: new WMTSTileGrid({
              origin: getTopLeft(this.projectionExtent),
              resolutions: this.resolutions,
              matrixIds: this.matrixIds
            }),
            style: 'default',
            wrapX: false
          })
        })
      ],
      view: new View({
        center: [150000, 450000],
        projection: this.projection,
        zoom: 3,
        minZoom: 0,
        maxZoom: 15
      })
    });
  }

}

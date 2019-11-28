import { Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { Map, View, Collection, Feature, } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { SpoorwegenService, ITileOptions } from '../layers/spoorwegen.service';

@Component({
  selector: 'app-lossekaart',
  templateUrl: './lossekaart.component.html',
  styleUrls: ['./lossekaart.component.css']
})
export class LossekaartComponent implements OnInit {

  private map: Map;

  private projectionExtent = [-285401.92, 22598.08, 595401.92, 903401.92];
  private projection = new Projection({
    code: 'EPSG:28992',
    units: 'm',
    extent: this.projectionExtent
  });

  private matrixIds = new Array(15);
  private resolutions = [
    3440.64,
    1720.32,
    860.16,
    430.08,
    215.04,
    107.52,
    53.75,
    26.88,
    13.44,
    6.72,
    3.36,
    1.68,
    0.84,
    0.42,
    0.21
  ];

  private layers = { // DE LAYERS AANROEPEN
    brt: 'brtachtergrondkaart',
    brtGrijs: 'brtachtergrondkaartgrijs',
    brtPastel: 'brtachtergrondkaartpastel',
    brtWater: 'brtachtergrondkaartwater'
  };

  baseTile = new WMTS({ // BEGIN VAN DE KAARTTEGEL MAKEN
    attributions:
      'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
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
  }); // EINDE VAN DE KAARTTEGEL

  baseLayer = new TileLayer({ // BEGIN VAN DE KAARTLAAG MAKEN EN TEGELS TOEVOEGEN
    source: this.baseTile,
    opacity: 0.7,
    visible: true,
    title: 'BaseLayer'
  } as ITileOptions); // EINDE VAN DE KAARTLAAG

  constructor() {}

  ngOnInit() {
    this.initializeMap();
  }
  initializeMap() { // BEGIN VAN DE MAP MAKEN
    for (let i = 0; i < this.matrixIds.length; i++) {
      this.matrixIds[i] = 'EPSG:28992:' + i;
    }
    this.map = new Map({ // MAAK DE MAP
      target: 'map',
      layers: [
       this.baseLayer,
      ],
      view: new View({
        center: [150000, 450000],
        projection: this.projection,
        zoom: 3,
        minZoom: 0,
        maxZoom: 15,
      }),
    });
  } // EINDE VAN DE MAP MAKEN
} // EINDE VAN DE COMPONENT NG ONINIT

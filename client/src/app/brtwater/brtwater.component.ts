import 'ol/ol.css';
import { Component, OnInit, } from '@angular/core';
import { Map, View, } from 'ol';

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import TileWMS from 'ol/source/TileWMS';
import { OSM, Vector as VectorSource, TileJSON} from 'ol/source';
import OlDraw from 'ol/interaction/Draw';
import { Icon, Stroke, Style, Fill, } from 'ol/style';
import WMTS from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { FormControl } from '@angular/forms';

import LocationSuggestData from '../interface/location-suggest-data.interface';

import { SuggestService } from '../components/service/suggest.service';
import { BestuurlijkegrenzenService } from '../layers/bestuurlijkegrenzen.service';
import { BagService } from '../layers/bag.service';
import { KaartService} from '../layers/kaart.service';
import { SpoorwegenService } from '../layers/spoorwegen.service';

import { HttpResponse } from '@angular/common/http';
import { OverigeDienstenService } from '../layers/overigediensten.service';

@Component({
  selector: 'app-brtwater',
  templateUrl: './brtwater.component.html',
  styleUrls: ['./brtwater.component.css']
})
export class BrtwaterComponent implements OnInit {

   private map: Map;
   private draw: OlDraw;

   source = new VectorSource({
    wrapX: false
  });
  vector = new VectorLayer({
    source: this.source,
    style: new Style({
      fill: new Fill({
        color: 'red',
      }),
      stroke: new Stroke({
        color: 'black',
        width: 3
      })
    })
  });

   private projectionExtent = [-285401.92, 22598.08, 595401.92, 903401.92];
   private projection = new Projection({ code: 'EPSG:28992', units: 'm', extent: this.projectionExtent });
   private matrixIds = new Array(15);
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

  private layers = {
    aan:  'aan',
    brt:  'brtachtergrondkaart',
    brtGrijs: 'brtachtergrondkaartgrijs',
    brtPastel: 'brtachtergrondkaartpastel',
    brtWater: 'brtachtergrondkaartwater',
    bestuurlijkegrenzen: {},
  };
  constructor(private suggestService: SuggestService,
              private spoorwegService: SpoorwegenService,
              private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
              private bagService: BagService,
              private kaartService: KaartService,
              private overigedienstenSerivce: OverigeDienstenService,
     ) {}

  brtWaterTile = new WMTS({
    attributions: 'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
    url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
    layer: this.layers.brtWater,
    // layer: 'this.typeSelectbrt.value',
    matrixSet: 'EPSG:28992',
    format: 'image/png',
    projection: this.projection,
    tileGrid: new WMTSTileGrid({
      origin: getTopLeft(this.projectionExtent),
      resolutions: this.resolutions,
      matrixIds: this.matrixIds,
    }),
    style: 'default',
    wrapX: false
   });

   brtWaterLayer = new TileLayer({
     source: this.brtWaterTile,
     visible: false,
     opacity: 0.7,
   });

  ngOnInit() {

  }

  initializeMap() {
    for (let i = 0; i < this.matrixIds.length; i++) {
      this.matrixIds[i] = 'EPSG:28992:' + i;
    }

    this.map = new Map({
      target: 'map',
      layers: [
        // this.baseLayer,
        this.brtWaterLayer,

        this.bestuurlijkegrenzenservice.landsgrensLayer,
        // this.bestuurlijkegrenzenservice.gemeentenLayer,
        // this.bestuurlijkegrenzenservice.provinciesLayer,

        // this.bagService.BagLigplaatsLayer,
        // this.bagService.BagPandLayer,
        // this.bagService.BagVerblijfsobjectLayer,
        // this.bagService.BagWoonplaatsLayer,
        // this.bagService.BagStandplaatsLayer,

        // this.overigedienstenSerivce.OverheidsdienstenLayer,
        // this.overigedienstenSerivce.AgrarischAreaalNederlandLayer,
        // this.overigedienstenSerivce.GeografischenamenLayer,

        // this.spoorwegService.KruisingLayer,
        // this.spoorwegService.OverwegLayer,
        // this.spoorwegService.SpoorasLayer,
        // this.spoorwegService.StationLayer,
        // this.spoorwegService.TraceLayer,
        // this.spoorwegService.WisselLayer,
        // this.spoorwegService.KilometreringLayer,

        // this.vector,
      ],
      overlays: [],
      view: new View({
        center: [150000, 450000],
        projection: this.projection,
        zoom: 3,
        minZoom: 0,
        maxZoom: 15
      }),
    });
  }


}

import 'ol/ol.css';
import { Component, OnInit } from '@angular/core';
import { Map, View, Collection } from 'ol';

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import TileWMS, { Options as TileWMSOptions } from 'ol/source/TileWMS';
import { Options as TileOptions } from 'ol/layer/tile';

import { OSM, Vector as VectorSource, TileJSON } from 'ol/source';
import OlDraw from 'ol/interaction/Draw';
import { Icon, Stroke, Style, Fill } from 'ol/style';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { FormControl } from '@angular/forms';

import LocationSuggestData from '../interface/location-suggest-data.interface';
import { SuggestService } from '../components/service/suggest.service';
import { BestuurlijkegrenzenService } from '../layers/bestuurlijkegrenzen.service';
import { BagService } from '../layers/bag.service';
import { KaartService } from '../layers/kaart.service';
import { SpoorwegenService } from '../layers/spoorwegen.service';

import { HttpResponse } from '@angular/common/http';
import { OverigeDienstenService } from '../layers/overigediensten.service';

import _ from 'underscore';
import LayerGroup from 'ol/layer/Group';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider} from 'ol/control';
import { zoom } from 'ol/interaction/Interaction';
import Zoom from 'ol/control/Zoom';
import { Button } from '@progress/kendo-angular-buttons';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  titles = 'Suggestie';

  typeSelectTekenen = new FormControl('');
  typeSelectdikzak = new FormControl('');
  typeSelectborder = new FormControl('');
  typeSelectbrt = new FormControl('');
  searchInput = new FormControl('');
  searchId = new FormControl('');
  searchSuggestions = new Array<object>();
  searchSpecificSuggestions = new Array<object>();

  invisible = false;
  Hide = false;
  isNotVisible = true;
  isVisible = false;

  private map: Map;
  private draw: OlDraw;

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

  private layers = {
    brt: 'brtachtergrondkaart',
    brtGrijs: 'brtachtergrondkaartgrijs',
    brtPastel: 'brtachtergrondkaartpastel',
    brtWater: 'brtachtergrondkaartwater'
  };

  source = new VectorSource({
    wrapX: false
  });
  tekenfunctie = new VectorLayer({
    source: this.source,
    style: new Style({
      fill: new Fill({
        color: 'red'
      }),
      stroke: new Stroke({
        color: 'black',
        width: 3
      })
    })
  });

  baseTile = new WMTS({
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
  });
  baseLayer = new TileLayer({
    source: this.baseTile,
    opacity: 0.7,
    visible: true,
    title: 'BaseLayer'
  } as ITileOptions);

  brtWaterTile = new WMTS({
    attributions:
      'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
    url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
    layer: this.layers.brtWater,
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
  });
  brtWaterLayer = new TileLayer({
    source: this.brtWaterTile,
    opacity: 0.7,
    visible: false,
    title: 'BrtWaterLayer'
  } as ITileOptions);

  brtGrijsTile = new WMTS({
    attributions:
      'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
    url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
    layer: this.layers.brtGrijs,
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
  });
  brtGrijsLayer = new TileLayer({
    source: this.brtGrijsTile,
    opacity: 0.7,
    visible: false,
    title: 'BrtGrijsLayer'
  } as ITileOptions);

  layergroupkaart = new LayerGroup ({
    layers: [
      this.baseLayer,
      this.brtWaterLayer,
      this.brtGrijsLayer,
    ]
  });
  layergroupgrenzen = new LayerGroup ({
    layers: [
      this.bestuurlijkegrenzenservice.landsgrensLayer,
      this.bestuurlijkegrenzenservice.gemeentenLayer,
      this.bestuurlijkegrenzenservice.provinciesLayer,
    ]
  });
  layergroupspoorwegen = new LayerGroup ({
    layers: [
      this.spoorwegService.KruisingLayer,
      this.spoorwegService.OverwegLayer,
      this.spoorwegService.SpoorasLayer,
      this.spoorwegService.StationLayer,
      this.spoorwegService.TraceLayer,
      this.spoorwegService.WisselLayer,
      this.spoorwegService.KilometreringLayer,
    ]
  });
  layergroupBag = new LayerGroup ({
    layers: [
     this.bagService.BagLigplaatsLayer,
     this.bagService.BagPandLayer,
     this.bagService.BagStandplaatsLayer,
     this.bagService.BagVerblijfsobjectLayer,
     this.bagService.BagWoonplaatsLayer
    ]
  });
  layergroupOverigeDiensten = new LayerGroup ({
    layers: [
      this.overigedienstenSerivce.OverheidsdienstenLayer,
      this.overigedienstenSerivce.AgrarischAreaalNederlandLayer,
      this.overigedienstenSerivce.GeografischenamenLayer
    ]
  });

  constructor(
    private suggestService: SuggestService,
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private kaartService: KaartService,
    private overigedienstenSerivce: OverigeDienstenService
  ) {}
  ngOnInit() {
    this.initializeMap();
    this.addInteraction();
    console.log(this.layers);
    console.log(this.map.getLayers());
    console.log(this.getLayerGroupGrenzen());
  }

  initializeMap() {
    for (let i = 0; i < this.matrixIds.length; i++) {
      this.matrixIds[i] = 'EPSG:28992:' + i;
    }
    this.map = new Map({
      target: 'map',
      layers: [
       this.baseLayer,
       this.brtWaterLayer,
       this.brtGrijsLayer,
       this.bestuurlijkegrenzenservice.landsgrensLayer,
       this.bestuurlijkegrenzenservice.gemeentenLayer,
       this.bestuurlijkegrenzenservice.provinciesLayer,
       this.bagService.BagLigplaatsLayer,
       this.bagService.BagPandLayer,
       this.bagService.BagVerblijfsobjectLayer,
       this.bagService.BagWoonplaatsLayer,
       this.bagService.BagStandplaatsLayer,
       this.overigedienstenSerivce.OverheidsdienstenLayer,
       this.overigedienstenSerivce.AgrarischAreaalNederlandLayer,
       this.overigedienstenSerivce.GeografischenamenLayer,
       this.spoorwegService.KruisingLayer,
       this.spoorwegService.OverwegLayer,
       this.spoorwegService.SpoorasLayer,
       this.spoorwegService.StationLayer,
       this.spoorwegService.TraceLayer,
       this.spoorwegService.WisselLayer,
       this.spoorwegService.KilometreringLayer,

       this.tekenfunctie
      ],
      view: new View({
        center: [150000, 450000],
        projection: this.projection,
        zoom: 3,
        minZoom: 0,
        maxZoom: 15,
      }),
      overlays: [],
      controls: defaultControls().extend([
        new ScaleLine({}),
        new Rotate({
          className: 'ol-rotate',
          label: 'F',
          tipLabel: 'test',
          duration: 250,
          autoHide: false
        }),
        new ZoomToExtent({extent: [-285401.92, 22598.08, 595401.92, 903401.92, ]}
      ),
        ])
    }),
    this.map.getLayers().extend([]);
    // this.map.getControls().extend([new ZoomToExtent({extent: [-285401.92, 22598.08, 595401.92, 903401.92]}) ]);
  }

  foo() {
    console.log('test');
    const alsjeblieft = document.createElement('div') as HTMLDivElement;
    return alsjeblieft;
  }
  getLayerGroupKaart() {
    return this.layergroupkaart.getLayers().getArray();
  }
  getLayerGroupBag() {
    return this.layergroupBag.getLayers().getArray();
  }
  getLayerGroupGrenzen() {
    return this.layergroupgrenzen.getLayers().getArray();
  }
  getLayerGroupOverigeDiensten() {
    return this.layergroupOverigeDiensten.getLayers().getArray();
  }
  getLayerGroupSpoorwegen() {
    return this.layergroupspoorwegen.getLayers().getArray();
  }
  getLayers() {
    return this.map.getLayers().getArray();
  }
  bLayervisible() {
    this.invisible = !this.invisible;
    const value = this.typeSelectdikzak.value;
    console.log('buttonworks2');
  }
  toggleDisplay() {
    this.Hide = !this.Hide;
    console.log('you click on hide');
  }
  isHidden() {
    this.isNotVisible = !this.isNotVisible;
    // this.isVisible = this.brtWaterLayer;
    console.log('you click on hide on visible');
  }
  tooltip() {}
  helptooltip() {}

  addInteraction() {
    const value = this.typeSelectTekenen.value;
    if (value !== '') {
      this.draw = new OlDraw({
        source: this.source,
        type: this.typeSelectTekenen.value
      });
      this.map.addInteraction(this.draw);
      console.log('addInteraction()');
    }
  }

  switchMode() {
    this.map.removeInteraction(this.draw);
    this.addInteraction();
    console.log('switchMode()');
  }

  grenzenInteraction() {
    const value = this.typeSelectborder.value;
    if (value !== '') {
    }
  }
  switchBorderMode() {
    this.grenzenInteraction();
    console.log(this.switchBorderMode);
  }

  switchLocationMode() {}
  switchRoutesMode() {}

  searchEntity() {
    const input = this.searchInput.value;
    this.suggestService.searchSuggest(input).subscribe(
      response => {
        console.log(response + 'response van de searchEntity');
        const data = response.body as LocationSuggestData;
        this.searchSuggestions = data.response.docs;
      },
      err => console.error(err)
    );
  }
}

export interface ITileOptions extends TileOptions {
  title?: string;
}

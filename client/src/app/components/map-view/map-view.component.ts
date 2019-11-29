import { Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { Map, View, Collection, Feature, } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { FormControl } from '@angular/forms';
import OlDraw from 'ol/interaction/Draw';
import TileWMS, { Options as TileWMSOptions } from 'ol/source/TileWMS';
import { Options as TileOptions } from 'ol/layer/Tile';
import { OSM, Vector as VectorSource, TileJSON } from 'ol/source';
import { Icon, Stroke, Style, Fill } from 'ol/style';
import LocationSuggestData from '../../interface/location-suggest-data.interface';
import { SuggestService } from '../../components/service/suggest.service';
import { BestuurlijkegrenzenService } from '../../layers/bestuurlijkegrenzen.service';
import { BagService } from '../../layers/bag.service';
import { KaartService } from '../../layers/kaart.service';
import { SpoorwegenService, ITileOptions } from '../../layers/spoorwegen.service';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap} from 'ol/control';

import { HttpResponse } from '@angular/common/http';
import { OverigeDienstenService } from '../../layers/overigediensten.service';

import LayerGroup from 'ol/layer/Group';


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  show1  = false;
  show2  = false;
  show3  = false;
  show4  = false;
  show5  = false;
  show6  = false;
  show7  = true;
  show8  = false;
  show9  = false;
  show10 = false;
  isShow = false;

  private map: Map;
  private draw: OlDraw;
  typeSelectTekenen = new FormControl('');


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

  brtWaterTile = new WMTS({ // BEGIN VAN DE KAARTTEGEL MAKEN
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
  }); // EINDE VAN DE KAARTTEGEL

  brtWaterLayer = new TileLayer({ // BEGIN VAN DE KAARTLAAG MAKEN EN TEGELS TOEVOEGEN
    source: this.brtWaterTile,
    opacity: 0.7,
    visible: false,
    title: 'BrtWaterLayer'
  } as ITileOptions); // EINDE VAN DE KAARTLAAG

  brtGrijsTile = new WMTS({ // BEGIN VAN DE KAARTTEGEL MAKEN
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
  }); // EINDE VAN DE KAARTTEGEL

  brtGrijsLayer = new TileLayer({ // BEGIN VAN DE KAARTLAAG MAKEN EN TEGELS TOEVOEGEN
    source: this.brtGrijsTile,
    opacity: 0.7,
    visible: false,
    title: 'BrtGrijsLayer'
  } as ITileOptions); // EINDE VAN DE KAARTLAAG

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


  @ViewChild('layerControlElement', { static: false }) layerControlElement: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;

  constructor(
    private suggestService: SuggestService,
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private kaartService: KaartService,
    private overigedienstenSerivce: OverigeDienstenService
  ) {}

  ngAfterViewInit() {
    this.initializeMap();
    this.addInteraction();
  }
  initializeMap() { // BEGIN VAN DE MAP MAKEN
    for (let i = 0; i < this.matrixIds.length; i++) {
      this.matrixIds[i] = 'EPSG:28992:' + i;
    }
    this.map = new Map({ // MAAK DE MAP
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

        this.tekenfunctie,
      ],
      view: new View({
        center: [150000, 450000],
        projection: this.projection,
        zoom: 3,
        minZoom: 0,
        maxZoom: 15,
      }),
      controls: defaultControls({
        attributionOptions: ({
          collapsible: false,
          target: 'mytestje',
        })
      }).extend([
        new Control({ element: this.layerControlElement.nativeElement }),
      ]).extend([])
    }),
    this.map.getLayers().extend([]);
  } // EINDE VAN DE MAP MAKEN

  toggle1() {
    this.show1 = !this.show1;
  }
  toggle2() {
    this.show2 = !this.show2;
  }
  toggle3() {
    this.show3 = !this.show3;
  }
  toggle4() {
    this.show4 = !this.show4;
  }
  addInteraction() {
    const value = this.typeSelectTekenen.value;
    if (value !== '') {
      this.draw = new OlDraw({
        source: this.source,
        type: value
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

} // EINDE VAN DE COMPONENT NG ONINIT

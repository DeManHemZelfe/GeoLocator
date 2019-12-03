import { Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { Map, View, Collection, Feature, } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { FormControl } from '@angular/forms';
import OlDraw from 'ol/interaction/Draw';


import {LineString, Polygon} from 'ol/geom';
import {getArea, getLength} from 'ol/sphere';
import { Circle as CircleStyle, Icon, Stroke, Style, Fill } from 'ol/style';



import TileWMS, { Options as TileWMSOptions } from 'ol/source/TileWMS';
import { Options as TileOptions } from 'ol/layer/Tile';
import { OSM, Vector as VectorSource, TileJSON } from 'ol/source';
import LocationSuggestData from '../interface/location-suggest-data.interface';
import { SuggestService } from '../components/service/suggest.service';
import { BestuurlijkegrenzenService } from '../layers/bestuurlijkegrenzen.service';
import { BagService } from '../layers/bag.service';
import { KaartService } from '../layers/kaart.service';
import { SpoorwegenService, ITileOptions } from '../layers/spoorwegen.service';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap} from 'ol/control';

import { HttpResponse } from '@angular/common/http';
import { OverigeDienstenService } from '../layers/overigediensten.service';

import LayerGroup from 'ol/layer/Group';


@Component({
  selector: 'app-lossekaart',
  templateUrl: './lossekaart.component.html',
  styleUrls: ['./lossekaart.component.css']
})
export class LossekaartComponent implements OnInit {


  private map: Map;
  private draw: OlDraw;

  sketch;
  helpTooltipElement;
  helpTooltip;
  measureTooltipElement;
  measureTooltip;
  output;
  continuePolygonMsg = 'Click to continue drawing the polygon';
  helpMsg = 'Click to start drawing';
  continueLineMsg = 'Click to continue drawing the line';
  typeSelectTekenen = new FormControl('');

  source = new VectorSource({
    wrapX: false
  });

  tekenfunctie = new VectorLayer({
    source: this.source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 3
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
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

  @ViewChild('layerControlElement', { static: false }) layerControlElement: ElementRef;

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
    console.log(this.addInteraction());

    this.map.on('pointermove', this.pointerMoveHandler);
    console.log('2');

    this.map.getViewport().addEventListener('mouseout', () => {
    this.helpTooltipElement.classList.add('hidden');
    console.log('3');
    });
  }

  initializeMap() { // BEGIN VAN DE MAP MAKEN
    for (let i = 0; i < this.matrixIds.length; i++) {
      this.matrixIds[i] = 'EPSG:28992:' + i;
    }
    this.map = new Map({ // MAAK DE MAP
      target: 'map',
      layers: [
       this.baseLayer,
       this.tekenfunctie,
      ],
      view: new View({
        center: [150000, 450000],
        projection: this.projection,
        zoom: 3,
        minZoom: 0,
        maxZoom: 15,
      }),
      controls: [
        // new Control({ element: this.layerControlElement.nativeElement })
      ],
    });
  } // EINDE VAN DE MAP MAKEN

  addInteraction() {
    const value = this.typeSelectTekenen.value;
    if (value === 'area' ? 'Polygon' : 'LineString') {
      this.draw = new OlDraw({
        source: this.source,
        type: value,
        style: new Style({
          fill: new Fill({
            color: 'rgba(225, 225, 225, 0.2)',
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: 'rgba(255, 2555, 255, 0.2)'
            })
          })
        })
      });
      this.map.addInteraction(this.draw);
      console.log('addInteraction()');
    }
  }
  switchMode() {
    this.map.removeInteraction(this.draw);
    this.addInteraction();
    console.log('switchMode()');
  } // EINDE SWITCHMODE EN ADDINTERACTION

  pointerMoveHandler(evt) {
    if (evt.dragging) {
      return;
    }

    if (this.sketch) {
      const geom = this.sketch.getGeometry();
      if (geom instanceof Polygon) {
        this.helpMsg = this.continuePolygonMsg;
      } else if (geom instanceof LineString) {
        this.helpMsg = this.continueLineMsg;
      }
    } // EINDE SKETCH

    this.helpTooltipElement.innerHTML = this.helpMsg;
    this.helpTooltip.setPosition(evt.coordinate);
    this.helpTooltipElement.classList.remove('hidden');

  } // EINDE POINTERMOVEHANDLER

  formatLength(line) { // BEGIN FUNCTION FORMATLENGTH
    const length = getLength(line);
    if (length > 100) {
      this.output = (Math.round(length / 1000 * 100) / 100) + '' + 'km';
    } else {
      this.output = (Math.round(length * 100) / 100) + '' + 'm';
    }
    return this.output;
  } // EINDE FUNCTION FORMATLENGTH

  formatArea(polygon) { // BEGIN FUNCTION FORMATLENGTH
    const area = getArea(polygon);
    if (area > 10000) {
      this.output = (Math.round(area / 1000000 * 100) / 100) + '' + 'km<sup>2</sup>';
    } else {
      this.output = (Math.round(area * 100) / 100) + '' + 'm<sup>2</sup>';
    }
    return this.output;
  } // EINDE FUNCTION FORMATLENGTH





} // EINDE VAN DE COMPONENT NG ONINIT

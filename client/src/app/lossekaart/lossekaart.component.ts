import { Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { Map, View, Collection, Feature, Overlay, MapBrowserEvent, } from 'ol';
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
import { OSM, Vector as VectorSource, TileJSON, Vector } from 'ol/source';
import LocationSuggestData from '../_interfaces/_datainterface/location-suggest-data-interface';
import { SuggestService } from '../components/service/suggest.service';
import { BestuurlijkegrenzenService } from '../layers/bestuurlijkegrenzen.service';
import { BagService } from '../layers/bag.service';
import { KaartService } from '../layers/kaart.service';
import { SpoorwegenService, ITileOptions } from '../layers/spoorwegen.service';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap} from 'ol/control';

import { HttpResponse } from '@angular/common/http';
import { OverigeDienstenService } from '../layers/overigediensten.service';

import LayerGroup from 'ol/layer/Group';
import GeometryType from 'ol/geom/GeometryType';
import { EventsKey } from 'ol/events';
import OverlayPositioning from 'ol/OverlayPositioning';
import { unByKey } from 'ol/Observable';
import WMSServerType from 'ol/source/WMSServerType';

@Component({
  selector: 'app-lossekaart',
  templateUrl: './lossekaart.component.html',
  styleUrls: ['./lossekaart.component.css']
})
export class LossekaartComponent implements OnInit {

  private map: Map;
  private draw: OlDraw;

  source = new VectorSource({
    wrapX: false
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

  testprovincie;
  wms_Provincielayer = new TileLayer({
    source: this.testprovincie = new TileWMS({
      url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?',
      params: {LAYERS: 'provincies', TILED: true},
  })
});
  view = new View({
    center: [150000, 450000],
    projection: this.projection,
    zoom: 3,
    minZoom: 0,
    maxZoom: 15,
});
     viewProjection = this.view.getProjection();
     viewResolution = this.view.getResolution();


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
  }

  initializeMap() { // BEGIN VAN DE MAP MAKEN
    for (let i = 0; i < this.matrixIds.length; i++) {
      this.matrixIds[i] = 'EPSG:28992:' + i;
    }
    this.map = new Map({ // MAAK DE MAP
      target: 'map',
      layers: [
       this.baseLayer,
       this.wms_Provincielayer,
      //  this.bestuurlijkegrenzenservice.provinciesLayer,
      //  this.tekenfunctie,
      ],
      view: this.view,
      controls: [
        // new Control({ element: this.layerControlElement.nativeElement })
      ],
    });
  } // EINDE VAN DE MAP MAKEN
  public onPlaceFound(place) {
    console.log(place);
    this.map.getView().animate({center: place.centroide_rd.coordinates, zoom: 12});
  }
  onClickLink() {
    console.log('https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?service=wfs&request=DescribeFeatureType');
  }
  onClickLink2() {}
  onClickLink3() {
    console.log('https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?service=wfs&request=DescribeFeatureType');
  }


  onClickprovincie(evt) {
     const url = this.bestuurlijkegrenzenservice.provinciesTile.getGetFeatureInfoUrl(
       evt.coordinates, this.viewResolution, this.viewProjection,
      {INFO_FORMAT: 'text/typescript', QUERY_LAYERS: 'provincies'});
     console.log(url);
   }

} // EINDE VAN DE COMPONENT NG ONINIT

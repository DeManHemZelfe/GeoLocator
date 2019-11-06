
import { Component, OnInit, } from '@angular/core';
import { Map, View, Feature } from 'ol';

// -----------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Layer from 'ol/layer/Layer';
import BaseTileLayer from 'ol/layer/BaseTile';
import PluggableMap from 'ol/PluggableMap';
import Draw from 'ol/interaction/Draw';
import { OSM, Vector as VectorSource, TileJSON, TileWMS } from 'ol/source';
import Point from 'ol/geom/Point';
import { Icon, Stroke, Style, Fill, } from 'ol/style';
import OlDraw from 'ol/interaction/Draw';
import WMTS from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { Tile, layer } from 'openlayers';
import {ATTRIBUTION} from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import LineString from 'ol/geom/LineString';
import GeometryType from 'ol/geom/GeometryType';
import { FormControl } from '@angular/forms';

import 'ol/ol.css';
import { SuggestService } from '../components/service/suggest.service';
import LocationSuggestData from '../interface/location-suggest-data.interface';
import { HttpResponse } from '@angular/common/http';
import Overlays from 'ol/Overlay';
import BaseLayer from 'ol/layer/Base';
import { imageOverlay } from 'leaflet';
import GeoJSON from 'ol/format/GeoJSON';







// import { __values } from 'tslib';


// import { source } from 'openlayers';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  titles = 'Suggestie';
  typeSelect = new FormControl('');
  searchInput = new FormControl('');
  // searchResults: object;
  searchSuggestions = new Array<object>();

   private map: Map;
   private draw: OlDraw;

  //  raster = new TileLayer({
  //   source: new OSM()
  // });

  source = new VectorSource({
    wrapX: false
  });

  vector = new VectorLayer({
    source: this.source,
    style: new Style({
      fill: new Fill({
        color: 'lightgreen',
      }),
      stroke: new Stroke({
        color: 'black',
        width: 3
      })
    })
  });



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

  // https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?request=GetCapabilities&service=wms

  // trailsLayer = new FeatureLayer({
  //   url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?request=GetCapabilities&service=wms'
  // });


  private layers = {
    brt: 'brtachtergrondkaart',
    brtGrijs: 'brtachtergrondkaartgrijs',
    brtPastel: 'brtachtergrondkaartpastel',
    brtWater: 'brtachtergrondkaartwater',
    bestuurlijkegrenzen: '',
  };




    base = new TileLayer({
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
        matrixIds: this.matrixIds,
      }),
      style: 'default',
      wrapX: false
    }),
  });


  overlays = new TileLayer({
    opacity: 0.7,
    source: new TileWMS({
      url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?request=GetCapabilities',
      params: {
        layers: this.layers.bestuurlijkegrenzen,
        format: 'image.png',
        matrixSet: 'EPSG:28992',
      },
      wrapX: false
    })
  });



  constructor(private suggestService: SuggestService) { }

  ngOnInit() {
    this.initializeMap();
    this.addInteraction();
  }


  initializeMap() {

    for (let i = 0; i < this.matrixIds.length; i++) {
      this.matrixIds[i] = 'EPSG:28992:' + i;
    }

    this.map = new Map({
      target: 'map',
      layers: [
        this.base,
        this.overlays,
        this.vector,
        // this.raster,
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


    addInteraction() {
    const value = this.typeSelect.value;
    if (value !== '') {
      this.draw = new OlDraw({
        source: this.source,
        type: this.typeSelect.value,
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

  searchEntity() {
    const input = this.searchInput.value;
    this.suggestService.searchSuggest(input).subscribe((response) => {
      console.log(response);
      const data = response.body as LocationSuggestData;
      this.searchSuggestions = data.response.docs;
      // for (const key of Object.keys(data.response)) {
      //   const highlight = data.highlighting[key];
      //   this.searchSuggestions.push(highlight.suggest);
      // }
    },
    (err) => console.error(err));
  }


}

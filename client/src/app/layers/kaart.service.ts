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

import LocationSuggestData from '../_interfaces/_datainterface/location-suggest-data-interface';

import { SuggestService } from '../components/service/suggest.service';
import { BestuurlijkegrenzenService } from '../layers/bestuurlijkegrenzen.service';
import { BagService } from '../layers/bag.service';
// import { KaartService} from '../layers/kaart.service';
import { SpoorwegenService } from '../layers/spoorwegen.service';

import { HttpResponse } from '@angular/common/http';
import { OverigeDienstenService } from '../layers/overigediensten.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KaartService {

  titles = 'Suggestie';
  typeSelect        = new FormControl('');
  typeSelectborder  = new FormControl('');
  typeSelectbrt     = new FormControl('');
  searchInput       = new FormControl('');
  searchId          = new FormControl('');
  searchSuggestions = new Array<object>();
  searchSpecificSuggestions = new Array<object>();

  private layers = {
    brt:  'brtachtergrondkaart',
    brtGrijs: 'brtachtergrondkaartgrijs',
    brtPastel: 'brtachtergrondkaartpastel',
    brtWater: 'brtachtergrondkaartwater',
  };

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

}


// baseTile = new WMTS({
//   attributions: 'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
//   url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
//   layer: this.layers.brtWater,
//   matrixSet: 'EPSG:28992',
//   format: 'image/png',
//   projection: this.projection,
//   tileGrid: new WMTSTileGrid({
//     origin: getTopLeft(this.projectionExtent),
//     resolutions: this.resolutions,
//     matrixIds: this.matrixIds,
//   }),
//   style: 'default',
//   wrapX: false
//  });

// //  baseLayer = new TileLayer({
// //    source: this.baseTile,
// //    opacity: 0.6,
// //  });

//  brtWater = new TileLayer({
//   opacity: 0.7,
//    source: new WMTS({
//      attributions: 'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
//      url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
//      layer: this.layers.brt,
//      matrixSet: 'EPSG:28992',
//      format: 'image/png',
//      projection: this.projection,
//      tileGrid: new WMTSTileGrid({
//        origin: getTopLeft(this.projectionExtent),
//        resolutions: this.resolutions,
//        matrixIds: this.matrixIds,
//      }),
//     style: 'default',
//     wrapX: false
//    }),
//  });


import { Injectable } from '@angular/core';
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { Map, View, Collection,  MapBrowserEvent  } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { FormControl } from '@angular/forms';
import OlDraw from 'ol/interaction/Draw';
import TileWMS, { Options as TileWMSOptions } from 'ol/source/TileWMS';
import { Options as TileOptions } from 'ol/layer/Tile';
import { OSM, Vector as VectorSource, TileJSON } from 'ol/source';
import { Icon, Stroke, Style, Fill, Circle} from 'ol/style';
import LocationSuggestData from '../../../_interfaces/_datainterface/location-suggest-data-interface';
import { BestuurlijkegrenzenService } from '../../../layers/bestuurlijkegrenzen.service';
import { BagService } from '../../../layers/bag.service';

import { SpoorwegenService, ITileOptions } from '../../../layers/spoorwegen.service';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap, Zoom} from 'ol/control';

import { OverigeDienstenService } from '../../../layers/overigediensten.service';
import {defaults as defaultInteractions, Modify, Select, Snap,  Translate, Draw } from 'ol/interaction';
import LayerGroup from 'ol/layer/Group';
import { GeocoderService } from 'angular-geocoder';
import { ToolbarFunctionsComponent } from '../../../functions/toolbar-functions/toolbar-functions.component';
import { getLocaleId } from '@angular/common';
import { LayerbuttonComponent } from '../../../functions/buttons-functions/layerbutton/layerbutton.component';
import { LayerButton } from '../../../functions/buttons-functions/layerbutton/layerbutton.service';
import { ServiceService } from '../../../pdokmap/pdokmapconfigmap/service.service';
import { BgService } from '../../../pdokmap/layer/bg.service';

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  private draw: OlDraw;
  drawFunctiontypeSelect = new FormControl('');
  drawSource = new VectorSource({
   wrapX: false,
  });
  drawFunction = new VectorLayer({
   source: this.drawSource,
   style: new Style({
    fill: new Fill({
     color: 'red'
    }),
    stroke: new Stroke({
     color: 'Black',
     width: 3
    }),
    image: new Circle({
     radius: 7,
     fill: new Fill({
     color: '#ffcc33'
     })
    })
   })
  });
  constructor(
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private overigedienstenSerivce: OverigeDienstenService,
    private buttonforlayers: LayerButton,
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    public geocoderService: GeocoderService,
  ) { }

  // addDrawInteraction() {
  //   const value = this.drawFunctiontypeSelect.value;
  //   if (value !== '') {
  //     this.draw = new OlDraw({
  //       source: this.drawSource,
  //       type: value,
  //     });
  //     this.map.addDrawInteraction(this.draw);
  //     this.draw.getMap().getCoordinateFromPixel([]);
  //     console.log(this.draw);
  //   }
  //   console.log('f');
  // }
  // switchMode() {
  //   this.map.removeDrawInteraction(this.draw);
  //   this.addDrawInteraction();
  //   console.log('switchMode()');
  // }

}

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
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { LayerconfigService } from '../config/layerconfig/layerconfig.service';
import { MapconfigService } from '../config/mapconfig/mapconfig.service';

@Component({
  selector: 'app-tp',
  templateUrl: './tp.component.html',
  styleUrls: ['./tp.component.css']
})
export class TpComponent implements AfterViewInit {

  map: Map;

  constructor(
    private layerconfig: LayerconfigService,
    private mapconfig: MapconfigService,
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private overigedienstenSerivce: OverigeDienstenService,
    private buttonforlayers: LayerButton,
    private achterkaart: BgService,
    public geocoderService: GeocoderService,
  ) {

  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() { // BEGIN VAN DE MAP MAKEN
    this.map = new Map({ // MAAK DE MAP
      target: 'map',
      layers: [
        this.layerconfig.baseLayer,
        // this.achterkaart.brtWaterLayer,
      ],
      view: this.mapconfig._view,
      controls: [
        new Control({ element: document.querySelector('div#app-toolbar') }),
        // new Control({ element: document.querySelector('div#app-search-bar') })
      ]
    });
  } // EINDE VAN DE MAP MAKEN

  eventHandler(event: string) {
    console.log(event);
    // const currentZoom = this.map.getView().getZoom();
    switch (event) {
     default:
     break;
    case 'zoom_in':
      this.map.getView().animate({ zoom: 10 + 1, duration: 250 });
      break;
      case 'zoom_out':
      this.map.getView().animate({ zoom: 20 - 1, duration: 250 });
      break;
    }
  }

}
export interface ITileOptions extends TileOptions {
  title?: string;
}

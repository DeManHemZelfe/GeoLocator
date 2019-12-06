import { Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { Map, View, Collection, Feature, } from 'ol';
import Overlay from 'ol/Overlay';

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import TileWMS, { Options as TileWMSOptions } from 'ol/source/TileWMS';
import { Options as TileOptions } from 'ol/layer/Tile';

import { OSM, Vector as VectorSource, TileJSON } from 'ol/source';
import OlDraw from 'ol/interaction/Draw';
import { Icon, Stroke, Style, Fill } from 'ol/style';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { FormControl } from '@angular/forms';

import LocationSuggestData from '../_interfaces/_datainterface/location-suggest-data-interface';
import { BestuurlijkegrenzenService } from '../layers/bestuurlijkegrenzen.service';
import { BagService } from '../layers/bag.service';

import { SpoorwegenService } from '../layers/spoorwegen.service';

import { HttpResponse } from '@angular/common/http';
import { OverigeDienstenService } from '../layers/overigediensten.service';

import LayerGroup from 'ol/layer/Group';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap} from 'ol/control';
import Interaction, { zoom } from 'ol/interaction/Interaction';
import Zoom from 'ol/control/Zoom';
import { Button } from '@progress/kendo-angular-buttons';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {unByKey} from 'ol/Observable';
import {getArea, getLength} from 'ol/sphere';
import CircleStyle from 'ol/style/Circle';
import { GeocoderService } from 'angular-geocoder';
import { BgService } from './layer/bg.service';
import { ServiceService } from './pdokmapconfigmap/service.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit {
  private map: Map;


  layergroupkaart = new LayerGroup ({
    // layers: [
    //   this.baseLayer,
    //   this.brtWaterLayer,
    //   this.brtGrijsLayer,
    // ]
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
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    private overigedienstenSerivce: OverigeDienstenService,
    private geocoderService: GeocoderService,
  ) {}

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {

    this.map = new Map({
      target: 'map',
      layers: [
       this.achterkaart.baseLayer,
       this.bestuurlijkegrenzenservice.landsgrensLayer,
       this.bestuurlijkegrenzenservice.provinciesLayer,
      ],
      view: this.mapconfig._view
    });
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
}
export interface ITileOptions extends TileOptions {
  title?: string;
}

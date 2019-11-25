import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Map, View } from 'ol';
import { Zoom, Control } from 'ol/control';

import { Icon, Stroke, Style, Fill } from 'ol/style';

import VectorSource from 'ol/source/Vector';

import VectorLayer from 'ol/layer/Vector';
import LayerGroup from 'ol/layer/Group';

import Draw from 'ol/interaction/Draw';

import { FormControl } from '@angular/forms';

import DefaultLayers from './map-layers/default.layers';
import MapConfig from './config/map.config';

import { SpoorwegenService } from '../../layers/spoorwegen.service';
import { SuggestService } from '../../components/service/suggest.service';
import { BagService } from '../../layers/bag.service';
import { BestuurlijkegrenzenService } from '../../layers/bestuurlijkegrenzen.service';
import { KaartService } from '../../layers/kaart.service';
import { OverigeDienstenService } from '../../layers/overigediensten.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  private map: Map; // The actual map object that renders the map

  // Fields required for the draw function to work
  private draw: Draw; // The draw object that implements the draw functionality
  drawType = new FormControl(''); // The select input field
  drawSource = new VectorSource({ wrapX: false }); // The source for every drawing style.
  drawVector = new VectorLayer({
    source: this.drawSource,
    style: new Style({
      fill: new Fill({
        color: 'red'
      }),
      stroke: new Stroke({
        color: 'black',
        width: 3
      })
    })
  });  // The actual layer that will get drawn on the map

  private mapConfig = new MapConfig(); // Config class for the map
  private defaultLayers: DefaultLayers; // All default layers for the map


  @ViewChild('layerControlElement', { static: false }) layerControlElement: ElementRef;

  // layergroupkaart = new LayerGroup ({
  //   layers: [
  //     this.baseLayer,
  //     this.brtWaterLayer,
  //     this.brtGrijsLayer,
  //   ]
  // });
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
  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.defaultLayers = new DefaultLayers(
      0,
      this.mapConfig.projection,
      this.mapConfig.projectionExtent,
      this.mapConfig.resolutions,
      this.mapConfig.matrixIds);

    this.map = new Map({
      target: 'map',
      layers: [
        this.drawVector,
        this.defaultLayers.bgLayer,
        // this.baseLayer,
        // this.brtWaterLayer,
        // this.brtGrijsLayer,
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
      ],
      view: new View({
        center: [150000, 450000],
        projection: this.mapConfig.projection,
        zoom: 3,
        minZoom: 0,
        maxZoom: 15
      }),
      controls: [
        new Zoom(),
        new Control({ element: this.layerControlElement.nativeElement })
      ]
    });
  }

  addInteraction() {
    const drawTypevalue = this.drawType.value;
    if (drawTypevalue !== '') {
      this.draw = new Draw({
        source: this.drawSource,
        type: drawTypevalue
      });
    }
    this.map.addInteraction(this.draw);
  }

  changeType() {
    this.map.removeInteraction(this.draw);
    this.addInteraction();
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

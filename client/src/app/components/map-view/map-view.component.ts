import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Map, View } from 'ol';
import { Zoom, Control } from 'ol/control';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { FormControl } from '@angular/forms';
import VectorLayer from 'ol/layer/Vector';
import DefaultLayers from './map-layers/default.layers';
import MapConfig from './config/map.config';

import { Icon, Stroke, Style, Fill } from 'ol/style';

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
  private drawSource = new VectorSource({ wrapX: false }); // The source for every drawing style.
  private drawVector = new VectorLayer({
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

  private initializeMap() {
    this.defaultLayers = new DefaultLayers(0,
      this.mapConfig.projection,
      this.mapConfig.projectionExtent,
      this.mapConfig.resolutions,
      this.mapConfig.matrixIds);

    this.map = new Map({
      target: 'map',
      layers: [
        this.drawVector,
        this.defaultLayers.bgLayer,
        this.bestuurlijkegrenzenservice.landsgrensLayer,
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
    const value = this.drawType.value;
    if (value) {
      this.draw = new Draw({
        source: this.drawSource,
        type: value
      });
    }
    this.map.addInteraction(this.draw);
  }

  changeType() {
    this.map.removeInteraction(this.draw);
    this.addInteraction();
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

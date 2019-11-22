import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Map, View } from 'ol';
import { Zoom, Control } from 'ol/control';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { FormControl } from '@angular/forms';
import VectorLayer from 'ol/layer/Vector';
import DefaultLayers from './map-layers/default.layers';
import MapConfig from './config/map.config';

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
  private drawVector = new VectorLayer({ // The actual layer that will get drawn on the map
    source: this.drawSource
  });

  private mapConfig = new MapConfig(); // Config class for the map
  private defaultLayers: DefaultLayers; // All default layers for the map

  @ViewChild('layerControlElement', { static: false }) layerControlElement: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    this.initializeMap();
  }

  private initializeMap() {
    this.defaultLayers = new DefaultLayers(0, this.mapConfig.projection, this.mapConfig.projectionExtent, this.mapConfig.resolutions, this.mapConfig.matrixIds);

    this.map = new Map({
      target: 'map',
      layers: [
        this.drawVector,
        this.defaultLayers.bgLayer,
        this.defaultLayers.landsgrensLayer
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

}

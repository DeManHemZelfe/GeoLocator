import { Component, OnInit } from '@angular/core';

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {Draw, Modify, Snap} from 'ol/interaction';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';


@Component({
  selector: 'app-map-view-bing',
  templateUrl: './map-view-bing.component.html',
  styleUrls: ['./map-view-bing.component.css']
})

export class MapViewBingComponent implements OnInit {

  private map: Map;

  constructor() { }

  ngOnInit() {
  }

}

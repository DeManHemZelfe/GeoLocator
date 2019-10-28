import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormBuilder, FormGroup } from '@angular/forms';

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Draw from 'ol/interaction/Draw';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import Polygon from 'ol/geom/Polygon';
import {ATTRIBUTION} from 'ol/source/OSM';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar-functions-draw.component.html',
  styleUrls: ['./sidebar-functions-draw.component.css']
})
export class SidebarFunctionsDrawComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }



}

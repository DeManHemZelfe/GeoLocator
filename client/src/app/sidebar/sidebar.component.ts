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
// import { __values } from 'tslib';


// import { source } from 'openlayers';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder) {this.drawForm = this.formBuilder.group({
    });
  }
  private map: Map;

  draw;
  drawForm;

  raster = new TileLayer({
    source: new OSM()
  });

  source = new VectorSource({wrapX: true});

  vector = new VectorLayer({
    source: this.source
  });

  // drawForm = FormGroup;
  typeSelect = FormGroup[this.drawForm];
  // typeSelect = document.getElementById('type');





  openCycleMapLayer = new TileLayer({
    source: new OSM ({
      attributions: [
        'All maps © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>',
        ATTRIBUTION
      ],
      url: 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
        '?apikey=Your API key from http://www.thunderforest.com/docs/apikeys/ here'
    })
  });

  openSeaMapLayer = new TileLayer({
    source: new OSM ({
      attributions: [
        'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
        ATTRIBUTION
      ],
      opaque: false,
      url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
    })
  });

  addInteraction() {
    const value = this.typeSelect.value;
    if (value !== 'None') {
      this.draw = new Draw({
        source: this.source,
        type: this.typeSelect.value,

      });
      this.map.addInteraction(this.draw);
    }
  }

    onchange() {
    this.map.removeInteraction(this.draw);
    this.addInteraction();
  }

  ngOnInit() {
    this.initializeMap();
    this.addInteraction();
  }
  onButtonClick() {
    console.log('click');
}

  private initializeMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.openCycleMapLayer,
        this.openSeaMapLayer,
        this.raster,
        this.vector,
      ],
      view: new View({
        center: [0, 0],
        // center: [-244780.24508882355, 5986452.183179816],
        projection: 'EPSG:4326',
        zoom: 4
      })
    });
  }


}

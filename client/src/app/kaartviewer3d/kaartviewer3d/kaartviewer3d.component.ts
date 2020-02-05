import { Component, OnInit } from '@angular/core';
import OLCesium from 'olcs/OLCesium.js';
import { Map, View } from 'ol';
import { BgService } from 'src/app/pdokmap/layer/bg.service';
import { ServiceService } from 'src/app/pdokmap/pdokmapconfigmap/service.service';
import { TileWMS } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { ITileOptions, BestuurlijkegrenzenService } from 'src/app/layers/bestuurlijkegrenzen.service';
import { addProjection } from 'ol/proj';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';
import { MapsManagerService } from 'angular-cesium';

proj4.defs('EPSG:28992',
  `+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000
  +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs`);
register(proj4);

@Component({
  selector: 'app-kaartviewer3d',
  templateUrl: './kaartviewer3d.component.html',
  styleUrls: ['./kaartviewer3d.component.css']
})
export class Kaartviewer3dComponent implements OnInit {
  map: Map;
  constructor(
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
  ) {
   }

  ngOnInit() {
    this.bestuurlijkegrenzenservice.gemeentenLayer.setVisible(true);
    this.initializeMap();

    const ol3d = new OLCesium({
      map: this.map,
      scene3DOnly: true,
      selectionIndicator: false,
      baseLayerPicker: false
    });
    ol3d.setEnabled(true);
  }

  initializeMap() {
  this.map = new Map({
    target: 'map',
    layers: [
      this.achterkaart.baseLayer,
      this.bestuurlijkegrenzenservice.gemeentenLayer,
    ],
    view: new View({
      center: [150000, 450000],
      zoom: 3,
      minZoom: 0,
      maxZoom: 15
    })
  });
  }


}

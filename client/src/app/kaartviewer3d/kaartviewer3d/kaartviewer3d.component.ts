import 'ol/ol.css';
import { Component, OnInit, ElementRef } from '@angular/core';
import OLCesium from 'olcs/OLCesium.js';
import { Map, View } from 'ol';
import { BgService } from 'src/app/pdokmap/layer/bg.service';
import { ServiceService } from 'src/app/pdokmap/pdokmapconfigmap/service.service';
import { TileWMS, OSM, WMTS } from 'ol/source';
import {get as getProjection} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { ITileOptions, BestuurlijkegrenzenService } from 'src/app/layers/bestuurlijkegrenzen.service';
import { addProjection } from 'ol/proj';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';
import { MapsManagerService } from 'angular-cesium';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { getTopLeft, getWidth } from 'ol/extent';
import Projection from 'ol/proj/Projection';
import { BagService } from 'src/app/layers/bag.service';

// tslint:disable-next-line: max-line-length
// Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MzAyNzUyYi0zY2QxLTQxZDItODRkOS1hNTA3MDU3ZTBiMDUiLCJpZCI6MjU0MSwiaWF0IjoxNTMzNjI1MTYwfQ.oHn1SUWJa12esu7XUUtEoc1BbEbuZpRocLetw6M6_AA';
// proj4.defs('EPSG:28992',
//   `+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000
//   +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs`);
// register(proj4);

@Component({
  selector: 'app-kaartviewer3d',
  templateUrl: './kaartviewer3d.component.html',
  styleUrls: ['./kaartviewer3d.component.css']
})
export class Kaartviewer3dComponent implements OnInit {
 map: Map;

 projection = getProjection('EPSG:3857');
 projectionExtent = this.projection.getExtent();
 size = getWidth(this.projectionExtent) / 256;
 resolutions = new Array(14);
 matrixIds = new Array(14);

  WorldWMTS = new WMTS({
    attributions: 'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
    url: 'https://services.arcgisonline.com/arcgis/rest/' + 'services/Demographics/USA_Population_Density/MapServer/WFS/',
    layer: '0',
    matrixSet: 'EPSG:3857',
    format: 'image/png',
    projection: this.projection,
    tileGrid: new WMTSTileGrid({
     origin: getTopLeft(this.projectionExtent),
     resolutions: this.resolutions,
      matrixIds: this.matrixIds,
  }),
   style: 'default',
   wrapX: true
  });
  WorldLayer = new TileLayer({
   source: this.WorldWMTS,
   opacity: 0.7,
   visible: true,
    title: 'BaseLayer',
  } as ITileOptions);
  constructor(
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    private bagService: BagService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private el: ElementRef,
  ) {
    for (let z = 0; z < 14; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      this.resolutions[z] = this.size / Math.pow(2, z);
      this.matrixIds[z] = z;
    }
  }

  ngOnInit() {
    this.bestuurlijkegrenzenservice.landsgrensLayer.setVisible(true);
    this.bagService.BagLigplaatsLayer.setVisible(true);
    this.bagService.BagPandLayer.setVisible(true);
    this.bagService.BagWoonplaatsLayer.setVisible(true);
    this.initializeMap();
    const ol3d = new OLCesium({ map: this.map});
    const scene = ol3d.getCesiumScene();
    // scene.globe.depthTestAgainstTerrain = true;
    console.log(scene);
    console.log(scene.imageryLayers);
    ol3d.setEnabled(true);
  }

  initializeMap() {
  this.map = new Map({
    target: 'map',
    layers: [
      new TileLayer({ source: new OSM(), opacity: 0.7 }),
      // this.WorldLayer,
      this.bestuurlijkegrenzenservice.landsgrensLayer,
      this.bagService.BagLigplaatsLayer,
      this.bagService.BagPandLayer,
      this.bagService.BagWoonplaatsLayer,
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

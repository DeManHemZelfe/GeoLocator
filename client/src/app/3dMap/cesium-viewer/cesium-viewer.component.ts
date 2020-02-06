import 'ol/ol.css';
import OLCesium from 'olcs/OLCesium.js';
import { Component, OnInit, ElementRef } from '@angular/core';
import { BgService } from 'src/app/pdokmap/layer/bg.service';
import { ServiceService } from 'src/app/pdokmap/pdokmapconfigmap/service.service';
import { ITileOptions, BestuurlijkegrenzenService } from 'src/app/layers/bestuurlijkegrenzen.service';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

// http://3dbag.bk.tudelft.nl/data/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng
// & TRANSPARENT=true & LAYERS=pand3d & CRS=EPSG % 3A28992 & STYLES=& WIDTH=2372
//   & HEIGHT=1193 & BBOX=84470.36509570591 % 2C446393.2899834048 % 2C85885.25310586767 % 2C447104.90945900464


// http://3dbag.bk.tudelft.nl/data/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY
// _LAYERS = pand3d & LAYERS=pand3d & INFO_FORMAT=application % 2Fjson
//   & I=50 & J=50 & CRS=EPSG % 3A28992 & STYLES=& WIDTH=101 & HEIGHT=101
//   & BBOX=85644.86530312938 % 2C445928.5452022424 % 2C85885.8496016561
//     % 2C446169.52950076904
// http://3dbag.bk.tudelft.nl/data/wms?request=getcapabilities wms Bag3d
// http://3dbag.bk.tudelft.nl/data/wfs?request=getcapabilities wfs Bag3D

// tslint:disable-next-line: max-line-length
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzYjlmMzhhNC05YWY2LTRjZGQtOWI0My1kOWMxNjFhODY2OWEiLCJpZCI6MjE5MTcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODA4ODkzMDl9.N-ehOLXvjf8txkhRQlwv7yAiP2dvhYIxwES7iy_cxMg';
proj4.defs('EPSG:28992',
  `+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000
  +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs`);
register(proj4);

@Component({
  selector: 'app-cesium-viewer',
  templateUrl: './cesium-viewer.component.html',
  styleUrls: ['./cesium-viewer.component.css']
})
export class CesiumViewerComponent implements OnInit {


  constructor(
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.bestuurlijkegrenzenservice.landsgrensLayer.setVisible(true);

    const viewer = new Cesium.Viewer('cesiumContainer', {
      // Toolbar functions
      scene3DOnly: false,
      selectionIndicator: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      animation: false,
      timeline: false,

      // Layers
    terrainProvider: Cesium.createWorldTerrain({
      url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles',
      requestWaterMask: true,
      requestVertexNormals: true
     }),
    });
    // Asset Layers
    const imageryLayer = viewer.imageryLayers.addImageryProvider(
       new Cesium.IonImageryProvider({ assetId: 3 })
    );
    console.log(viewer);
    // Camera View
    const CameraView = {
    destination: Cesium.Cartesian3.fromDegrees(5.2615304, 52.4034638, 50000.0)
    };
    // Viewer scene option
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.enableLighting = false;
    viewer.scene.camera.setView(CameraView);
  }
}

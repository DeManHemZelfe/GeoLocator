import 'ol/ol.css';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Map, View} from 'ol';
import { BgService } from 'src/app/pdokmap/layer/bg.service';
import { ServiceService } from 'src/app/pdokmap/pdokmapconfigmap/service.service';
import { OSM, WMTS, ImageWMS, TileWMS, BingMaps, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { ITileOptions, BestuurlijkegrenzenService } from 'src/app/layers/bestuurlijkegrenzen.service';
// Service
import { BagService } from 'src/app/layers/bag.service';
// Cesium
import OLCesium from 'olcs/OLCesium.js';
import olcsCore from 'olcs/core.js';
// Projection
import Projection from 'ol/proj/Projection';
import { addProjection } from 'ol/proj';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';
import ImageLayer from 'ol/layer/Image';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Stroke, Style, Fill, Circle } from 'ol/style';
import OlDraw from 'ol/interaction/Draw';
import { FormControl } from '@angular/forms';
import Attribution from 'ol/control/Attribution';
import * as test3D from 'ol-ext/layer/Render3D.js';

// https://osmbuildings.org/documentation/viewer/
// osmb.addGeoJSONTiles('http://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');

// https://tiles.arcgis.com/tiles/nSZVuSZjHpEZZbRo/arcgis/rest/services/Amsterdam_RD/SceneServer
// https://tiles.arcgis.com/tiles/nSZVuSZjHpEZZbRo/arcgis/rest/services/3D_Gebouwhoogte_NL/SceneServer

// http://3dbag.bk.tudelft.nl/data/wfs?SERVICE=WFS&REQUEST=GetFeature&TYPENAMES=BAG3D:pand3d
// & CQL_FILTER=identificatie =% 270513100011117421 % 27 & outputFormat=json
// tslint:disable-next-line: max-line-length
// Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MzAyNzUyYi0zY2QxLTQxZDItODRkOS1hNTA3MDU3ZTBiMDUiLCJpZCI6MjU0MSwiaWF0IjoxNTMzNjI1MTYwfQ.oHn1SUWJa12esu7XUUtEoc1BbEbuZpRocLetw6M6_AA';
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
  private map: Map;
  private draw: OlDraw;

  vectorSource = new VectorSource(
    {	url: '../data/ignf.json',
      // projection: 'EPSG:3857',
      format: new GeoJSON(),
      attributions: [ '&copy; <a href=\'http://professionnels.ign.fr/bdtopo\'>ign.fr</a>' ]
    });
   vector = new VectorLayer(
      {	source: this.vectorSource,
        maxResolution: 2
     });

  buildings = new VectorLayer({
    source: new VectorSource({
    url: 'https://{s}.data.osmbuildings.org/0.2/dixw8kmb/tile/{z}/{x}/{y}.json',
      format: new GeoJSON()
    }),
  });

  test = new TileLayer({
    source: new XYZ({
     attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
     url: 'https://{s}.data.osmbuildings.org/0.2/dixw8kmb/tile/{z}/{x}/{y}.json',
    })
   });


  Worldraster = new TileLayer({
   source: new XYZ({
    attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
   })
  });

  constructor(
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    private bagService: BagService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    this.bestuurlijkegrenzenservice.landsgrensLayer.setVisible(true);
    this.bagService.BagLigplaatsLayer.setVisible(true);
    this.bagService.BagPandLayer.setVisible(true);
    this.initializeMap();

    // Const
    const ol3d = new OLCesium({map: this.map});
    const scene = ol3d.getCesiumScene();
    scene.globe.depthTestAgainstTerrain = true;
    console.log(scene);
    console.log(scene.imageryLayers);
    ol3d.setEnabled(true);
  }

  initializeMap() {
  this.map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      this.bestuurlijkegrenzenservice.landsgrensLayer,
      this.vector
      // this.test,
      // this.buildings,

      // new TileLayer({ source: new OSM(), opacity: 0.7}),
      // this.bagService.BagLigplaatsLayer,
      // this.bagService.BagPandLayer,
    ],
    view: new View({
      center: [150000, 450000],
      projection: 'EPSG:3857',
      zoom: 3,
      minZoom: 0,
      maxZoom: 15,
    })
  });
  }


}


// bagSource = new ImageWMS({
//   serverType: 'geoserver',
//   crossOrigin: 'anonymous',
//  url: 'http://3dbag.bk.tudelft.nl/data/wfs',
//  url: 'http://godzilla.bk.tudelft.nl:8090/geoserver/BAG3D/ows?SERVICE=WMS&',
//   params: { LAYERS: 'pand3d' },
//   projection: 'EPSG:28992',
// });

// bag = new ImageLayer({
//   source: this.bagSource,
//   visible: true,
// });

/*********************************************

This query is compiled by OSM Buildings.
It returns buildings for currently visible
map area.

Click RUN to run the query.
When done, click EXPORT to save the result.

If you are looking for:

- large areas and faster downloads
- additional data sets
- more file formats
- real 3d models from complex buildings
- consistent building types and attributes

All are available on https://3dbuildings.com/

*********************************************/
// [out:json][timeout:30];(
//   way["building"]({{bbox}});
//   relation["building"]["type"="multipolygon"]({{bbox}});
//   );out;>;out qt;


/*********************************************

This query is compiled by OSM Buildings.
It returns buildings for currently visible
map area.

Click RUN to run the query.
When done, click EXPORT to save the result.

If you are looking for:

- large areas and faster downloads
- additional data sets
- more file formats
- real 3d models from complex buildings
- consistent building types and attributes

All are available on https://3dbuildings.com/

*********************************************/

// [out:json][timeout:30];(
//   way["building"](41.890059343429265,12.488405406475067,41.89094387978588,12.489820271730421);
//   relation["building"]["type"="multipolygon"](41.890059343429265,12.488405406475067,41.89094387978588,12.489820271730421);
//   );out;>;out qt;

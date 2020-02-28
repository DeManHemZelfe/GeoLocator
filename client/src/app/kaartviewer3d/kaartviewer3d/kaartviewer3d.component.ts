import 'ol/ol.css';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Map, View} from 'ol';
import { BgService } from 'src/app/pdokmap/layer/bg.service';
import { ServiceService } from 'src/app/pdokmap/pdokmapconfigmap/service.service';
import { ITileOptions, BestuurlijkegrenzenService } from 'src/app/layers/bestuurlijkegrenzen.service';
// Service
import { BagService } from 'src/app/layers/bag.service';
// Cesium
import OLCesium from 'olcs/OLCesium.js';
import olcsCore from 'olcs/core.js';
// Projection

import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Stroke, Style, Fill, Circle, Text, RegularShape } from 'ol/style';
import render3D from 'ol-ext/layer/Render3D.js';
import {bbox} from 'ol/loadingstrategy';
import { createRegularPolygon } from 'ol/interaction/Draw';
import { MultiPoint, Polygon } from 'ol/geom';
import { DEVICE_PIXEL_RATIO } from 'ol/has';

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
  globaalHeight = 1;
  checkR3D2 = true;
  BuidlingsHeightCheck = true;
  EnableBuidlings3DCheck = false;

  pandSource = new VectorSource({
    format: new GeoJSON(),
    url: (extent, resolution, projection) => {
      return 'https://cors-anywhere.herokuapp.com/http://godzilla.bk.tudelft.nl:8090/geoserver/BAG3D/wfs?service=WFS&' +
        'version=1.0.0&request=GetFeature&typeName=pand3d&' +
        'outputFormat=json&srsname=EPSG:28992&' +
        'bbox=' + extent.join(',') + ',EPSG:28992';
    },
    strategy: bbox
  });
  pand3DLayer = new VectorLayer({
    minResolution: 0,
    maxResolution: 0.7,
    source: this.pandSource,
    zIndex: 4,
  });




  vectors = new VectorSource({
    format: new GeoJSON(),
    url: (extent, resolution, projection) => {
      return 'https://cors-anywhere.herokuapp.com/http://godzilla.bk.tudelft.nl:8090/geoserver/BAG3D/wfs?service=WFS&' +
        'version=1.0.0&request=GetFeature&typeName=pand3d&' +
        'outputFormat=json&srsname=EPSG:28992&' +
        'bbox=' + extent.join(',') + ',EPSG:28992';
    },
    strategy: bbox,
  });

  fill = new Fill();
  style = new Style({
    fill: this.fill,
    stroke: new Stroke({
      color: 'yellow',
    })
  });
  vectorl = new VectorLayer({
    source: this.vectors,
    style: this.drawFunction()
  });

  // gebouwVloerstyle = new render3D({
  //   source: this.pandSource,
  //   maxZoom: 15,
  //   opacity: 0.5,
  //   height: 0,
  //   zIndex: 0,
  //   maxResolution: 0.5,
  //   defaultHeight: 3.6,
  //   style: new Style({
  //     fill: new Fill({ color: 'yellow' }),
  //     stroke: new Stroke({color: 'black', width: 2}),
  //   }),
  // });
  // gebouwGrondStyle = new Style({
  //   fill: new Fill({ color: 'lightblue' }),
  //   stroke: new Stroke({color: 'pink', lineDash: [10, 10], width: 3})
  // });

  r3D = new render3D({
    source: this.pandSource,
    maxZoom: 15,
    height: 0,
    zIndex: 2,
    maxResolution: 0.5,
    defaultHeight: 0,
    style: this.drawFunction()
  });

  EersteVerdieping = new render3D({
    source: this.pandSource,
    maxZoom: 15,
    height: 0,
    zIndex: 3,
    maxResolution: 0.5,
    defaultHeight: 3.6,
    style: this.drawFunction()
  });

  constructor(
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    private bagService: BagService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.initializeMap();
    /**
     * SetLayer: Zet de r3D en de r3D2 aan op de pand3DLayer
     * AddLayer: Voegt de pand3DLayer toe aan de map
     */
    this.EersteVerdieping.setLayer(this.pand3DLayer);
    this.r3D.setLayer(this.pand3DLayer);
    this.map.addLayer(this.pand3DLayer);
    // for (let step = 0; step < 10; step++) {
    //   const loopBuildings = new render3D({
    //     source: this.pandSource,
    //     maxZoom: 15,
    //     height: 0.2 * step,
    //     zIndex: 1,
    //     maxResolution: 0.5,
    //     defaultHeight: 3.6,
    //     style: new Style({
    //       fill: new Fill({color: 'yellow'}),
    //       stroke: new Stroke({color: 'black', width: 3}),
    //     }),
    //   });
    //   loopBuildings.setLayer(this.pand3DLayer);
    // }

    // Bereken de hoogte van een gebouw.
    // Hoogte3D.setLayer(this.pand3DLayer);
    // Bijv: hoogte is 5 meter.
    // Maak een polygon op de coordinaten van het gebouw.
    // Maak om de meter een loop en bouw dan een polygon.
    // Bijv: meter 0 : Het begin en hier doet de gebouwGrondStyle zelf de kleur
    // meter 1: rood, meter 2: rood, meter 3: rood, meter 4: rood, meter 5: Het einde en hier doet de r3D zelf de kleur,

    // const ol3d = new OLCesium({map: this.map});
    // const scene = ol3d.getCesiumScene();
    // scene.globe.depthTestAgainstTerrain = true;
    // ol3d.setEnabled(true);
    console.log(this.r3D);
  }
  initializeMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        // new TileLayer({ source: new OSM(), opacity: 0.7, visible: true }),
        this.achterkaart.baseLayer
      ],
      view: new View({
        center: [150000, 450000],
        projection: 'EPSG:28992',
        zoom: 3,
        minZoom: 0,
        maxZoom: 25,
      })
    });
  }
  drawFunction() {
    // Fill
    this.fill.setColor(this.pat());
    this.fill.setColor('blue');
    // Return
    return this.style;
  }
  pat() {
     // Canvas
     const canvas = document.createElement('canvas');
     const context = canvas.getContext('2d');
     const pixelRatio = DEVICE_PIXEL_RATIO;

     // width and height
     canvas.width = 8 * pixelRatio;
     canvas.height = 8 * pixelRatio;

     // Fill the roof
     context.createPattern(canvas, 'repeat');
     context.lineWidth = 10;

    //  context.strokeRect(75, 140, 150, 110);
     context.fillRect(0, 0, canvas.width, canvas.height);
     context.beginPath();
     context.arc(4 * pixelRatio, 4 * pixelRatio, 1 * pixelRatio, 0, 2 * Math.PI);
     this.style.setStroke(new Stroke({
       color: 'red', width: 2, lineCap: 'square'
     })
     );
     // Return the style
     return context.createPattern(canvas, 'repeat');
  }

  /** Animate Function
   * Set 3D layer true or false
   */
  BuildingAnime(event) {
    // Enable 2D and disable 3D
    if (event === 'building2D') {
      this.EnableBuidlings3DCheck = false;
      this.BuidlingsHeightCheck = false;
      if (this.EnableBuidlings3DCheck === false) {
        this.r3D.animate({ height: 0 });
      }
    }
    // Enable 2D and disable 3D
    if (event === 'building3D') {
      this.EnableBuidlings3DCheck = true;
      this.BuidlingsHeightCheck = true;
      if (this.EnableBuidlings3DCheck === true) {
        this.r3D.animate({ height: (feature) => feature.get('roof-0.75') });
      }
    }
  }
  doAnime(event) {
    if (this.r3D.animating()) {return; }
    if (this.EnableBuidlings3DCheck === false) {return; }
    if (this.EnableBuidlings3DCheck === true) {
      this.r3D.animate({height: (feature) => feature.get(event)});
    }
  }
}

import { Component, OnInit } from '@angular/core';

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Draw from 'ol/interaction/Draw';
import { OSM, Vector as VectorSource } from 'ol/source';
import Point from 'ol/geom/Point';
import { Icon, Stroke, Style } from 'ol/style';
import OlDraw from 'ol/interaction/Draw';
import { ATTRIBUTION } from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import LineString from 'ol/geom/LineString';
import GeometryType from 'ol/geom/GeometryType';

@Component({
  selector: 'app-map-view-open-street',
  templateUrl: './map-view-open-street.component.html',
  styleUrls: ['./map-view-open-street.component.css']
})
export class MapViewOpenStreetComponent implements OnInit {
  raster = new TileLayer({
    source: new OSM()
  });

  source = new VectorSource();

  vector = new VectorLayer({
    source: this.source,
    style: this.styleFunction
  });
  draw: OlDraw;

  private map: Map;

  openCycleMapLayer = new TileLayer({
    source: new OSM({
      attributions: [
        'All maps © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>',
        ATTRIBUTION
      ],
      url:
        'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
        '?apikey=Your API key from http://www.thunderforest.com/docs/apikeys/ here'
    })
  });

  openSeaMapLayer = new TileLayer({
    source: new OSM({
      attributions: [
        'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
        ATTRIBUTION
      ],
      opaque: false,
      url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
    })
  });

  constructor() {}

  ngOnInit() {
    this.initializeMap();
    this.styleFunction('type');
  }

  styleFunction(feature) {
    const geometry = feature.getGeometry();
    const styles = [
      // linestring
      new Style({
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        })
      })
    ];
    // geometry.forEachSegment (function(start, end) {
    geometry.forEachSegment = (start, end) => {
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const rotation = Math.atan2(dy, dx);
      // arrows
      styles.push(
        new Style({
          geometry: new Point(end),
          image: new Icon({
            src: 'data/arrow.png',
            anchor: [0, 75, 0.5],
            rotateWithView: true,
            rotation: -rotation
          })
        })
      );
    };

    return styles;
  }

  initializeMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        this.raster,
        this.vector,
        this.openCycleMapLayer,
        this.openSeaMapLayer
      ],
      view: new View({
        center: fromLonLat([4.89707, 52.377956]),
        // center: [-244780.24508882355, 5986452.183179816],
        // projection: 'EPSG:4326',
        zoom: 7
      })
    });
    this.map.addInteraction(

      new Draw({
        source: this.source,
        type: GeometryType.CIRCLE
      })
    );
  }
}

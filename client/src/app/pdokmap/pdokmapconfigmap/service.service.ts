import {Injectable} from '@angular/core';
import {View} from 'ol';
import Projection from 'ol/proj/Projection';
import { addProjection } from 'ol/proj';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

proj4.defs('EPSG:28992',
  `+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000
  +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs`);
register(proj4);
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
// The map projection.
private projectionExtent = [-285401.92, 22598.08, 595401.9199999999, 903401.9199999999];
public readonly projection = new Projection({ code: 'EPSG:28992', units: 'm', extent: this.projectionExtent });

// Zoom resolutions
private resolutions = [
  3440.640,
  1720.320,
  860.160,
  430.080,
  215.040,
  107.520,
  53.750,
  26.880,
  13.440,
  6.720,
  3.360,
  1.680,
  0.840,
  0.420,
  0.210
];
// The matrix properties
private matrixIds = new Array(15);
private matrixSet = 'EPSG:28992';

// Tyle format
private format = 'image/png';

// Get request url for tiles
private url = 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts';

// The view object
private view = new View({
  center: [150000, 450000],
  projection: this.projection,
  zoom: 3,
  minZoom: 0,
  maxZoom: 15,
});

constructor() {
  for (let i = 0, n = this.matrixIds.length; i < n; i++) {
    this.matrixIds[i] = `EPSG:28992:${i}`;
  }
  addProjection(this.projection);
}

get _projectionExtent() {
  return this.projectionExtent;
}
get _projection() {
  return this.projection;
}
get _resolutions() {
  return this.resolutions;
}
get _matrixIds() {
  return this.matrixIds;
}
get _matrixSet() {
  return this.matrixSet;
}
get _format() {
  return this.format;
}
get _url() {
  return this.url;
}
get _view() {
  return this.view;
}

}

import {Injectable} from '@angular/core';
import {View} from 'ol';
import Projection from 'ol/proj/Projection';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
// The map projection.
private projectionExtent = [-285401.92, 22598.08, 595401.9199999999, 903401.9199999999];
private projection = new Projection({ code: 'EPSG:28992', units: 'm', extent: this.projectionExtent });

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
  maxZoom: 15
});

constructor() {
  for (let i = 0, n = this.matrixIds.length; i < n; i++) {
    this.matrixIds[i] = `EPSG:28992:${i}`;
  }
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

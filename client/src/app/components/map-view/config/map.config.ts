// import Projection from 'ol/proj/Projection';

// export default class MapConfig {
//   private _projectionExtent = [-285401.92, 22598.08, 595401.92, 903401.92];
//   private _projection = new Projection({ code: 'EPSG:28992', units: 'm', extent: this._projectionExtent });
//   private _resolutions = [
//     3440.640,
//     1720.320,
//     860.160,
//     430.080,
//     215.040,
//     107.520,
//     53.750,
//     26.880,
//     13.440,
//     6.720,
//     3.360,
//     1.680,
//     0.840,
//     0.420,
//     0.210
//   ];
//   private _matrixIds = new Array(15);

//   constructor() {
//     for (let i = 0; i < this._matrixIds.length; i++) {
//       this._matrixIds[i] = 'EPSG:28992:' + i;
//     }
//   }

//   get projectionExtent() {
//     return this._projectionExtent;
//   }

//   get projection() {
//     return this._projection;
//   }

//   get resolutions() {
//     return this._resolutions;
//   }

//   get matrixIds() {
//     return this._matrixIds;
//   }
// }

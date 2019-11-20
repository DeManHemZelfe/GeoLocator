import { Injectable } from '@angular/core';
import TileWMS, {Options as TileWMSOptions} from 'ol/source/TileWMS';
import TileLayer, {Options as TileOptions} from 'ol/layer/tile';
import { Vector as VectorLayer } from 'ol/layer';

@Injectable({
  providedIn: 'root'
})
export class OverigeDienstenService {

  AgrarischAreaalNederlandTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/aan/wms?',
    params: {LAYERS: 'aan', TILED: true},
    crossOrigin: 'anonymous',
   });
   AgrarischAreaalNederlandLayer = new TileLayer({
    source: this.AgrarischAreaalNederlandTile,
    title: 'AgrarischAreaalNederland',
   } as ITileOptions);

   OverheidsDienstenTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/overheidsdiensten/wms?',
    params: {LAYERS: 'overheidsdiensten', TILED: true},
    crossOrigin: 'anonymous',
   });
   OverheidsdienstenLayer = new TileLayer({
    source: this.OverheidsDienstenTile,
    title: 'OverHeidsDiensten',
   } as ITileOptions);

   GeografischenameTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/inspire/gn/wms?',
    params: {LAYERS: 'GN.GeographicalNames', TILED: true},
    crossOrigin: 'anonymous',
   });
   GeografischenamenLayer = new TileLayer({
   source: this.GeografischenameTile,
   title: 'GeoGrafischeMeter',
  } as ITileOptions);
}

export interface ITileOptions extends TileOptions {
  title?: string;
}

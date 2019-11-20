import { Injectable } from '@angular/core';
import TileWMS from 'ol/source/TileWMS';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

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
    source: this.AgrarischAreaalNederlandTile
   });

   OverheidsDienstenTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/overheidsdiensten/wms?',
    params: {LAYERS: 'overheidsdiensten', TILED: true},
    crossOrigin: 'anonymous',
   });

   OverheidsdienstenLayer = new TileLayer({
    source: this.OverheidsDienstenTile,
   });

   GeografischenameTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/inspire/gn/wms?',
    params: {LAYERS: 'GN.GeographicalNames', TILED: true},
    crossOrigin: 'anonymous',
   });

   GeografischenamenLayer = new TileLayer({
   source: this.GeografischenameTile
  });

}

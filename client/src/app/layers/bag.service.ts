import { Injectable } from '@angular/core';
import TileWMS from 'ol/source/TileWMS';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

@Injectable()
export class BagService {

  BagLigplaatsTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/bag/wms?',
    params: {LAYERS: 'pand', TILED: true},
    crossOrigin: 'anonymous',
   });

   BagLigplaatsLayer = new TileLayer({
    source: this.BagLigplaatsTile
   });

   BagPandTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/bag/wms?',
    params: {LAYERS: 'pand', TILED: true},
    crossOrigin: 'anonymous',
   });

   BagPandLayer = new TileLayer({
    source: this.BagPandTile
   });

   BagVerblijfsobjectTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/bag/wms?',
    params: {LAYERS: 'verblijfsobject', TILED: true},
    crossOrigin: 'anonymous',
   });

   BagVerblijfsobjectLayer = new TileLayer({
    source: this.BagVerblijfsobjectTile
   });

   BagWoonsplaatsTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/bag/wms?',
    params: {LAYERS: 'woonplaats', TILED: true},
    crossOrigin: 'anonymous',
   });

  BagWoonplaatsLayer = new TileLayer({
   source: this.BagWoonsplaatsTile
  });

  BagStandplaatsTile = new TileWMS({
   url: 'https://geodata.nationaalgeoregister.nl/bag/wms?',
   params: {LAYERS: 'standplaats', TILED: true},
   crossOrigin: 'anonymous',
  });

  BagStandplaatsLayer = new TileLayer({
   source: this.BagStandplaatsTile
  });
}

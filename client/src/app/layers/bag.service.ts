import { Injectable } from '@angular/core';
import TileWMS, {Options as TileWMSOptions} from 'ol/source/TileWMS';
import TileLayer, {Options as TileOptions} from 'ol/layer/tile';
import { Vector as VectorLayer } from 'ol/layer';

@Injectable()
export class BagService {

  BagLigplaatsTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/bag/wms?',
    params: {LAYERS: 'pand', TILED: true},
    crossOrigin: 'anonymous',
   });
   BagLigplaatsLayer = new TileLayer({
    source: this.BagLigplaatsTile,
    title: 'BagLigPlaatst',
   } as ITileOptions);

   BagPandTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/bag/wms?',
    params: {LAYERS: 'pand', TILED: true},
    crossOrigin: 'anonymous',
   });
   BagPandLayer = new TileLayer({
    source: this.BagPandTile,
    title: 'BagPand',
   } as ITileOptions);

   BagVerblijfsobjectTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/bag/wms?',
    params: {LAYERS: 'verblijfsobject', TILED: true},
    crossOrigin: 'anonymous',
   });
   BagVerblijfsobjectLayer = new TileLayer({
    source: this.BagVerblijfsobjectTile,
    title: 'BagVerblijf',
   } as ITileOptions);

   BagWoonsplaatsTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/bag/wms?',
    params: {LAYERS: 'woonplaats', TILED: true},
    crossOrigin: 'anonymous',
   });
  BagWoonplaatsLayer = new TileLayer({
   source: this.BagWoonsplaatsTile,
   title: 'BagWoonplaatst',
  } as ITileOptions);

  BagStandplaatsTile = new TileWMS({
   url: 'https://geodata.nationaalgeoregister.nl/bag/wms?',
   params: {LAYERS: 'standplaats', TILED: true},
   crossOrigin: 'anonymous',
  });
  BagStandplaatsLayer = new TileLayer({
   source: this.BagStandplaatsTile,
   title: 'BagStandPlaats',
  } as ITileOptions);
}
export interface ITileOptions extends TileOptions {
  title?: string;
}


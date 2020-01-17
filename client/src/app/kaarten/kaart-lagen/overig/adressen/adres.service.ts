import { Injectable } from '@angular/core';
import TileWMS, {Options as TileWMSOptions} from 'ol/source/TileWMS';
import TileLayer, {Options as TileOptions} from 'ol/layer/Tile';
import { Vector as VectorLayer } from 'ol/layer';


@Injectable()
export class AdresService {

  AdresTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/inspireadressen/wms?',
    params: {LAYERS: 'inspireadressen', TILED: true, title: 'Adressen'},
    crossOrigin: 'anonymous',
   });
   AdresLayer = new TileLayer({
    source: this.AdresTile,
    title: 'Adressen',
    visible: false,
   } as ITileOptions);
}
export interface ITileOptions extends TileOptions {
  title?: string;
}

import { Injectable } from '@angular/core';
import TileWMS, {Options as TileWMSOptions} from 'ol/source/TileWMS';
import TileLayer, {Options as TileOptions} from 'ol/layer/Tile';
import { Vector as VectorLayer } from 'ol/layer';


@Injectable()
export class BestuurlijkegrenzenService {

    landsgrensTile = new TileWMS({
      url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?',
      params: {LAYERS: 'landsgrens', TILED: true},
      crossOrigin: 'anonymous',
    });
    landsgrensLayer = new TileLayer({
     source: this.landsgrensTile,
     title: 'LandsGrens',
     visible: false,
    } as ITileOptions);

    gemeentenTile = new TileWMS({
     url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?',
     params: {LAYERS: 'gemeenten', TILED: true},
     crossOrigin: 'anonymous',
    });
    gemeentenLayer = new TileLayer({
     source: this.gemeentenTile,
     title: 'GemeentenGrens',
     visible: false,
    } as ITileOptions);

    provinciesTile = new TileWMS({
     url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?',
     params: {LAYERS: 'provincies', TILED: true},
     crossOrigin: 'anonymous',
    });
    provinciesLayer = new TileLayer({
     source: this.provinciesTile,
     title: 'ProvinciesGrens',
     visible: false,
    } as ITileOptions);
  }

export interface ITileOptions extends TileOptions {
    title?: string;
  }



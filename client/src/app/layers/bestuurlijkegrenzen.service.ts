import { Injectable } from '@angular/core';
import TileWMS from 'ol/source/TileWMS';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

@Injectable()
export class BestuurlijkegrenzenService {

    landsgrensTile = new TileWMS({
      url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms',
      params: {LAYERS: 'landsgrens', TILED: true},
      crossOrigin: 'anonymous',
    });

    landsgrensLayer = new TileLayer({
     source: this.landsgrensTile
    });

    gemeentenTile = new TileWMS({
     url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms',
     params: {LAYERS: 'gemeenten', TILED: true},
     crossOrigin: 'anonymous',
    });

    gemeentenLayer = new TileLayer({
     source: this.gemeentenTile
    });

    provinciesTile = new TileWMS({
     url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms',
     params: {LAYERS: 'provincies', TILED: true},
     crossOrigin: 'anonymous',
    });

    provinciesLayer = new TileLayer({
     source: this.provinciesTile
    });
  }


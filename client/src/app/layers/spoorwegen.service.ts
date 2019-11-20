
import { Injectable } from '@angular/core';
import TileWMS, {Options as TileWMSOptions} from 'ol/source/TileWMS';
import TileLayer, {Options as TileOptions} from 'ol/layer/tile';
import { Vector as VectorLayer } from 'ol/layer';

@Injectable()
export class SpoorwegenService {

  KruisingTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'kruising', TILED: true},
    crossOrigin: 'anonymous',
  });
  KruisingLayer = new TileLayer({
   source: this.KruisingTile,
   title: 'Kruising'
  } as ITileOptions);

  OverwegTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'overweg', TILED: true},
    crossOrigin: 'anonymous',
  });
  OverwegLayer = new TileLayer({
   source: this.OverwegTile,
   title: 'OverWeg'
  } as ITileOptions);

  SpoorasTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'spooras', TILED: true},
    crossOrigin: 'anonymous',
  });
  SpoorasLayer = new TileLayer({
   source: this.SpoorasTile,
   title: 'SpoorAs',
  } as ITileOptions);

  StationTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'station', TILED: true},
    crossOrigin: 'anonymous',
  });
  StationLayer = new TileLayer({
   source: this.StationTile,
   title: 'Station',
  } as ITileOptions);

  TraceTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'trace', TILED: true},
    crossOrigin: 'anonymous',
  });
  TraceLayer = new TileLayer({
   source: this.TraceTile,
   title: 'Trace',
  } as ITileOptions);

  WisselTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'wissel', TILED: true},
    crossOrigin: 'anonymous',
  });
  WisselLayer = new TileLayer({
   source: this.WisselTile,
   title: 'Wissel',
  } as ITileOptions);

  KilometreringTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'kilometrering', TILED: true},
    crossOrigin: 'anonymous',
  });
  KilometreringLayer = new TileLayer({
   source: this.KilometreringTile,
   title: 'Kilometering',
  } as ITileOptions);
}
export interface ITileOptions extends TileOptions {
  title?: string;
}

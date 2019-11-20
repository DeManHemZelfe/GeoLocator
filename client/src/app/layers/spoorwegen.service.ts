
import { Injectable } from '@angular/core';
import TileWMS from 'ol/source/TileWMS';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

@Injectable()
export class SpoorwegenService {

  KruisingTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'kruising', TILED: true},
    crossOrigin: 'anonymous',
  });
  KruisingLayer = new TileLayer({
   source: this.KruisingTile
  });

  OverwegTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'overweg', TILED: true},
    crossOrigin: 'anonymous',
  });

  OverwegLayer = new TileLayer({
   source: this.OverwegTile
  });

  SpoorasTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'spooras', TILED: true},
    crossOrigin: 'anonymous',
  });

  SpoorasLayer = new TileLayer({
   source: this.SpoorasTile
  });

  StationTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'station', TILED: true},
    crossOrigin: 'anonymous',
  });

  StationLayer = new TileLayer({
   source: this.StationTile
  });

  TraceTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'trace', TILED: true},
    crossOrigin: 'anonymous',
  });

  TraceLayer = new TileLayer({
   source: this.TraceTile
  });

  WisselTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'wissel', TILED: true},
    crossOrigin: 'anonymous',
  });

  WisselLayer = new TileLayer({
   source: this.WisselTile
  });

  KilometreringTile = new TileWMS({
    url: 'https://geodata.nationaalgeoregister.nl/spoorwegen/wms?',
    params: {LAYERS: 'kilometrering', TILED: true},
    crossOrigin: 'anonymous',
  });

  KilometreringLayer = new TileLayer({
   source: this.KilometreringTile
  });

}

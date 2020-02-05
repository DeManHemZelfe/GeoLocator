import { Injectable } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import {ServiceService} from '../pdokmapconfigmap/service.service';
import WMTS from 'ol/source/WMTS';
import TileWMS from 'ol/source/TileWMS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { getTopLeft } from 'ol/extent';
import { ITileOptions } from 'src/app/layers/spoorwegen.service';

@Injectable({
  providedIn: 'root'
})
export class BgService {
  private configservice = new ServiceService();
  private layers = {
   brt: 'brtachtergrondkaart',
   brtGrijs: 'brtachtergrondkaartgrijs',
   brtPastel: 'brtachtergrondkaartpastel',
   brtWater: 'brtachtergrondkaartwater'
  };

  baseTile = new WMTS({
    attributions: 'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
    url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
    layer: this.layers.brt,
    matrixSet: 'EPSG:28992',
    format: 'image/png',
    // projection: this.configservice._projection,
    tileGrid: new WMTSTileGrid({
     origin: getTopLeft(this.configservice._projectionExtent),
     resolutions: this.configservice._resolutions,
      matrixIds: this.configservice._matrixIds,
  }),
   style: 'default',
   wrapX: false
  });
  baseLayer = new TileLayer({
   source: this.baseTile,
   opacity: 0.7,
   visible: true,
    title: 'BaseLayer',
  } as ITileOptions);

  brtWaterTile = new WMTS({ // BEGIN VAN DE KAARTTEGEL MAKEN
    attributions:
      'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
    url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
    layer: this.layers.brtWater,
    matrixSet: 'EPSG:28992',
    format: 'image/png',
    projection: this.configservice._projection,
    tileGrid: new WMTSTileGrid({
      origin: getTopLeft(this.configservice._projectionExtent),
      resolutions: this.configservice._resolutions,
      matrixIds: this.configservice._matrixIds
    }),
    style: 'default',
    wrapX: false
   }); // EINDE VAN DE KAARTTEGEL
  brtWaterLayer = new TileLayer({ // BEGIN VAN DE KAARTLAAG MAKEN EN TEGELS TOEVOEGEN
    source: this.brtWaterTile,
    opacity: 0.7,
    visible: false,
    title: 'BrtWaterLayer'
   } as ITileOptions); // EINDE VAN DE KAARTLAAG

  brtGrijsTile = new WMTS({ // BEGIN VAN DE KAARTTEGEL MAKEN
    attributions:
      'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
    url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
    layer: this.layers.brtGrijs,
    matrixSet: 'EPSG:28992',
    format: 'image/png',
    projection: this.configservice._projection,
    tileGrid: new WMTSTileGrid({
      origin: getTopLeft(this.configservice._projectionExtent),
      resolutions: this.configservice._resolutions,
      matrixIds: this.configservice._matrixIds
    }),
    style: 'default',
    wrapX: false
    }); // EINDE VAN DE KAARTTEGEL
  brtGrijsLayer = new TileLayer({ // BEGIN VAN DE KAARTLAAG MAKEN EN TEGELS TOEVOEGEN
    source: this.brtGrijsTile,
    opacity: 0.7,
    visible: false,
    title: 'BrtGrijsLayer'
  } as ITileOptions); // EINDE VAN DE KAARTLAAG



}

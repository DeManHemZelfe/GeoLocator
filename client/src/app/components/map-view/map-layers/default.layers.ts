import TileLayer, { Options } from 'ol/layer/Tile';
import WMTS from 'ol/source/WMTS';
import TileWMS from 'ol/source/TileWMS';
import Projection from 'ol/proj/Projection';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { getTopLeft } from 'ol/extent';

export default class DefaultLayers {
  private bgLayersStyles: Array<string> = [
  'brtachtergrondkaart',
  'brtachtergrondkaartgrijs',
  'brtachtergrondkaartpastel',
  'brtachtergrondkaartwater'
  ];

  constructor(
    private bgLayerStyle: number,
    private projection: Projection,
    private projectionExtend: Array<number>,
    private resolutions: Array<number>,
    private matrixIds: Array<string>
    ) { }

  get bgLayer() {
    const bgLayer = new TileLayer({
      opacity: 0.7,
      source: new WMTS({
        attributions: 'Kaartgegevens van PDOK',
        url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
        layer: this.bgLayersStyles[this.bgLayerStyle],
        matrixSet: 'EPSG:28992',
        format: 'image/png',
        projection: this.projection,
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(this.projectionExtend),
          resolutions: this.resolutions,
          matrixIds: this.matrixIds
        }),
        style: 'default',
        wrapX: false
      })
    });
    
    return bgLayer;
  }

  get landsgrensLayer() {
    const landgrensTile = new TileWMS({
      url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms',
      params: { LAYERS: 'landsgrens' },
      crossOrigin: 'anonymous'
    });

    const landgrensLayer = new TileLayer({
      source: landgrensTile,
      title: 'Landsgrens',
      visible: true
    } as Options);
    
    return landgrensLayer;
  }
}

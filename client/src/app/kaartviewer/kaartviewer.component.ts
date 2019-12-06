import { Component, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import { Map, View, Collection,  MapBrowserEvent  } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
import Projection from 'ol/proj/Projection';
import { getTopLeft } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { FormControl } from '@angular/forms';
import OlDraw from 'ol/interaction/Draw';
import TileWMS, { Options as TileWMSOptions } from 'ol/source/TileWMS';
import { Options as TileOptions } from 'ol/layer/Tile';
import { OSM, Vector as VectorSource, TileJSON } from 'ol/source';
import { Icon, Stroke, Style, Fill, Circle} from 'ol/style';
import LocationSuggestData from '../_interfaces/_datainterface/location-suggest-data-interface';
import { BestuurlijkegrenzenService } from '../layers/bestuurlijkegrenzen.service';
import { BagService } from '../layers/bag.service';

import { SpoorwegenService, ITileOptions } from '../layers/spoorwegen.service';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap, Zoom} from 'ol/control';

import { OverigeDienstenService } from '../layers/overigediensten.service';
import {defaults as defaultInteractions, Modify, Select, Snap,  Translate, Draw } from 'ol/interaction';
import LayerGroup from 'ol/layer/Group';
import { GeocoderService } from 'angular-geocoder';
import { ToolbarFunctionsComponent } from '../functions/toolbar-functions/toolbar-functions.component';
import { getLocaleId } from '@angular/common';
import { LayerbuttonComponent } from '../functions/buttons-functions/layerbutton/layerbutton.component';
import { LayerButton } from '../functions/buttons-functions/layerbutton/layerbutton.service';
import { ServiceService } from '../pdokmap/pdokmapconfigmap/service.service';
import { BgService } from '../pdokmap/layer/bg.service';


@Component({
  selector: 'app-kaartviewer',
  templateUrl: './kaartviewer.component.html',
  styleUrls: ['./kaartviewer.component.css']
})
export class KaartviewerComponent implements AfterViewInit {
  show1  = false;
  show2  = false;
  show3  = false;
  show4  = false;
  show5  = false;
  show6  = false;
  show7  = false;
  show8  = false;
  show9  = false;
  show10 = false;
  show11 = false;
  show12 = false;
  show13 = false;
  show14 = false;
  show15 = false;
  isShow = false;


  public searchInput = '';
  public places = [];
  public collations = [];
  public searchThreshold = 2;
  public foundPlace: any = null;
  public selectedItem = [];
  public selectedIndex = -1;

  grenzenvisi = false;
  bagvisi = false;
  spoorvisi = false;
  dienstenvisi = false;

  private map: Map;
  private draw: OlDraw;

  typeSelectTekenen = new FormControl('');

  modifyselect = new Select();
  modifytranslate = new Translate({
    features: this.modifyselect.getFeatures(),
  });

  select = new Select({
    wrapX: false
  });

  source = new VectorSource({
    wrapX: false,
  });

  tekenfunctie = new VectorLayer({
    source: this.source,
    style: new Style({
      fill: new Fill({
        color: 'red'
      }),
      stroke: new Stroke({
        color: 'Black',
        width: 3
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
  });

  private projectionExtent = [-285401.92, 22598.08, 595401.92, 903401.92];
  private projection = new Projection({
    code: 'EPSG:28992',
    units: 'm',
    extent: this.projectionExtent
  });
  private matrixIds = new Array(15);
  private resolutions = [
    3440.64,
    1720.32,
    860.16,
    430.08,
    215.04,
    107.52,
    53.75,
    26.88,
    13.44,
    6.72,
    3.36,
    1.68,
    0.84,
    0.42,
    0.21
  ];

  private layers = { // DE LAYERS AANROEPEN
    brt: 'brtachtergrondkaart',
    brtGrijs: 'brtachtergrondkaartgrijs',
    brtPastel: 'brtachtergrondkaartpastel',
    brtWater: 'brtachtergrondkaartwater'
  };

  baseTile = new WMTS({ // BEGIN VAN DE KAARTTEGEL MAKEN
    attributions:
      'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
    url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
    layer: this.layers.brt,
    matrixSet: 'EPSG:28992',
    format: 'image/png',
    projection: this.projection,
    tileGrid: new WMTSTileGrid({
      origin: getTopLeft(this.projectionExtent),
      resolutions: this.resolutions,
      matrixIds: this.matrixIds
    }),
    style: 'default',
    wrapX: false
   }); // EINDE VAN DE KAARTTEGEL
  baseLayer = new TileLayer({ // BEGIN VAN DE KAARTLAAG MAKEN EN TEGELS TOEVOEGEN
    source: this.baseTile,
    opacity: 0.7,
    visible: true,
    title: 'BaseLayer'
   } as ITileOptions); // EINDE VAN DE KAARTLAAG

  brtWaterTile = new WMTS({ // BEGIN VAN DE KAARTTEGEL MAKEN
    attributions:
      'Kaartgegevens: $copy <a href="http://www.kadaster.nl>Kadaster</a>',
    url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts',
    layer: this.layers.brtWater,
    matrixSet: 'EPSG:28992',
    format: 'image/png',
    projection: this.projection,
    tileGrid: new WMTSTileGrid({
      origin: getTopLeft(this.projectionExtent),
      resolutions: this.resolutions,
      matrixIds: this.matrixIds
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
    projection: this.projection,
    tileGrid: new WMTSTileGrid({
      origin: getTopLeft(this.projectionExtent),
      resolutions: this.resolutions,
      matrixIds: this.matrixIds
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




@ViewChild('layerControlElement', { static: false }) layerControlElement: ElementRef;
@ViewChild('menu', { static: false }) menu: ElementRef;
@ViewChild('searchmenu', { static: false }) searchmenu: ElementRef;
@ViewChild('toolbarmenu', { static: false }) toolbarmenu: ElementRef;

    select_interaction;
    id;
    draw_interaction;
    snap = new Snap({source: this.source});

constructor(
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private overigedienstenSerivce: OverigeDienstenService,
    private buttonforlayers: LayerButton,
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    public geocoderService: GeocoderService,
  ) {}

ngAfterViewInit() {
    this.initializeMap();
    this.addInteraction();
    console.log(this.bestuurlijkegrenzenservice.gemeentenTile.getUrls());
    console.log(this.bestuurlijkegrenzenservice.provinciesTile.getUrls());
  }
initializeMap() { // BEGIN VAN DE MAP MAKEN
    for (let i = 0; i < this.matrixIds.length; i++) {
      this.matrixIds[i] = 'EPSG:28992:' + i;
    }
    this.map = new Map({ // MAAK DE MAP
      interactions: defaultInteractions().extend([
        this.modifyselect, this.modifytranslate,
      ]),
      target: 'map',
      layers: [
        this.achterkaart.baseLayer,
        this.achterkaart.brtWaterLayer,
        this.achterkaart.brtGrijsLayer,
        this.bestuurlijkegrenzenservice.landsgrensLayer,
        this.bestuurlijkegrenzenservice.gemeentenLayer,
        this.bestuurlijkegrenzenservice.provinciesLayer,
        this.bagService.BagLigplaatsLayer,
        this.bagService.BagPandLayer,
        this.bagService.BagVerblijfsobjectLayer,
        this.bagService.BagWoonplaatsLayer,
        this.bagService.BagStandplaatsLayer,
        this.overigedienstenSerivce.OverheidsdienstenLayer,
        this.overigedienstenSerivce.AgrarischAreaalNederlandLayer,
        this.overigedienstenSerivce.GeografischenamenLayer,
        this.spoorwegService.KruisingLayer,
        this.spoorwegService.OverwegLayer,
        this.spoorwegService.SpoorasLayer,
        this.spoorwegService.StationLayer,
        this.spoorwegService.TraceLayer,
        this.spoorwegService.WisselLayer,
        this.spoorwegService.KilometreringLayer,

        this.tekenfunctie,
      ],
      view: new View({
        center: [150000, 450000],
        projection: this.projection,
        zoom: 3,
        minZoom: 0,
        maxZoom: 15,
      }),
      controls: [
        new Control({ element: this.searchmenu.nativeElement }),
        new Control({ element: this.toolbarmenu.nativeElement }),
        new Control({ element: this.layerControlElement.nativeElement }),
      ]
    });
  } // EINDE VAN DE MAP MAKEN

toggle1() {
    this.show1 = !this.show1;
  }
toggle2() {
    this.show2 = !this.show2;
  }
toggle3() {
    this.show3 = !this.show3;
  }
toggle4() {
    this.show4 = !this.show4;
  }
toggle5() {
    this.show5 = !this.show5;
  }
  toggle6() {
    this.show6 = !this.show6;
  }
  toggle7() {
    this.show7 = !this.show7;
  }
  toggle8() {
    this.show8 = !this.show8;
  }
  toggle9() {
    this.show9 = !this.show9;
  }
  toggle10() {
    this.show10 = !this.show10;
  }
  toggle11() {
    this.show11 = !this.show11;
  }
  toggle12() {
    this.show12 = !this.show12;
  }
  toggle13() {
    this.show13 = !this.show13;
  }
  toggle14() {
    this.show14 = !this.show14;
  }
  toggleGrenzen() {
    this.grenzenvisi = !this.grenzenvisi;
  }
  toggleBag() {
    this.bagvisi = !this.bagvisi;
  }
  toggleSpoor() {
    this.spoorvisi = !this.spoorvisi;
  }
  toggleDiensten() {
    this.dienstenvisi = !this.dienstenvisi;
  }
  modifyfunctionselect() {
    console.log('er is op de functie geklikt');
  }

  addInteraction() {
    const value = this.typeSelectTekenen.value;
    if (value !== '') {
      this.draw = new OlDraw({
        source: this.source,
        type: value,
      });
      this.map.addInteraction(this.draw);
      this.map.addInteraction(this.snap);
      this.draw.getMap().getCoordinateFromPixel([]);
      console.log(this.draw);
    }
    console.log('f');
  }
  switchMode() {
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.snap);
    this.addInteraction();
    console.log('switchMode()');
  }
  undo() {
    const features = this.source.getFeatures();
    const lastFeature = features[features.length - 1];
    this.source.removeFeature(lastFeature);
    console.log(this.tekenfunctie.getSource());
    console.log(this.tekenfunctie.getSource());
    console.log(this.tekenfunctie.getSource().getFeatures().values());
    console.log('je hebt op de knop geklikt');
    console.log('maak een unieke id aan of probeer met de value iets aan te geven, of zet alles in een array');
  }
  redo() {
    const features = this.source.getFeatures();
    const lastFeature = features[features.length + 1];
    this.source.addFeature(lastFeature);
    console.log(this.tekenfunctie.getSource());
    console.log(this.tekenfunctie.getSource());
    console.log(this.tekenfunctie.getSource().getFeatures().values());
    console.log('je hebt op de knop geklikt');
    console.log('maak een unieke id aan of probeer met de value iets aan te geven, of zet alles in een array');
  }
  public onPlaceFound(place) {
    console.log(place);
    this.map.getView().animate({center: place.centroide_rd.coordinates, zoom: 12});
  }

  getKaartButton() {
    return this.buttonforlayers.getLayerGroupKaart();
  }
  getGrenzenButton() {
    return this.buttonforlayers.getLayerGroupGrenzen();
  }
  getBagButton() {
    return this.buttonforlayers.getLayerGroupBag();
  }
  getDienstenButton() {
    return this.buttonforlayers.getLayerGroupOverigeDiensten();
  }
  getSpoorButton() {
    return this.buttonforlayers.getLayerGroupSpoorwegen();
  }



} // EINDE VAN DE COMPONENT NG ONINIT

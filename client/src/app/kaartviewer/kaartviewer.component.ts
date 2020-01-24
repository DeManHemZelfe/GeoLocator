import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ɵConsole, Output, EventEmitter, Input } from '@angular/core';
import { Map, View, Collection,  MapBrowserEvent, Feature  } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import { FormControl } from '@angular/forms';
import OlDraw, { DrawEvent } from 'ol/interaction/Draw';
import TileWMS, { Options as TileWMSOptions } from 'ol/source/TileWMS';
import { OSM, Vector as VectorSource, TileJSON, ImageWMS } from 'ol/source';
import { Icon, Stroke, Style, Fill, Circle} from 'ol/style';
import { BestuurlijkegrenzenService } from '../layers/bestuurlijkegrenzen.service';
import { BagService } from '../layers/bag.service';
import GeoJSON from 'ol/format/GeoJSON';
import { SpoorwegenService, ITileOptions } from '../layers/spoorwegen.service';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap, Zoom} from 'ol/control';
import { OverigeDienstenService } from '../layers/overigediensten.service';
import {defaults as defaultInteractions, Modify, Snap, Draw} from 'ol/interaction';
import { GeocoderService } from 'angular-geocoder';
import { LayerButton } from '../functions/buttons-functions/layerbutton/layerbutton.service';
import { ServiceService } from '../pdokmap/pdokmapconfigmap/service.service';
import { BgService } from '../pdokmap/layer/bg.service';
import Select, { SelectEvent } from 'ol/interaction/Select';
import { transformExtent, addProjection,  } from 'ol/proj';
import Translate from 'ol/interaction/Translate';
import Transform from 'ol-ext/interaction/transform';
import { Polygon, LineString, Geometry } from 'ol/geom';
import {getArea, getLength} from 'ol/sphere';
import GeometryType from 'ol/geom/GeometryType';
import { AdresService } from '../kaarten/kaart-lagen/overig/adressen/adres.service';
// import Feature from 'ol/Feature';
// import LayerGroup from 'ol/layer/Group';
// import TileSource from 'ol/source/Tile';
// import { TooltipDirective } from '@progress/kendo-angular-tooltip';
// import { style } from '@angular/animations';
// import {click, pointerMove, altKeyOnly, singleClick, doubleClick} from 'ol/events/condition';
// import { ToolbarFunctionsComponent } from '../functions/toolbar-functions/toolbar-functions.component';
// import { getLocaleId } from '@angular/common';
// import { LayerbuttonComponent } from '../functions/buttons-functions/layerbutton/layerbutton.component';
// import { transformGeom2D } from 'ol/geom/SimpleGeometry';
// import ImageLayer from 'ol/layer/Image';
// import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
// import { Options as TileOptions } from 'ol/layer/Tile';
// import LocationSuggestData from '../_interfaces/_datainterface/location-suggest-data-interface';
// import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS';
// import Projection from 'ol/proj/Projection';
// import { getTopLeft } from 'ol/extent';
// import WMTSTileGrid from 'ol/tilegrid/WMTS';
@Component({
  selector: 'app-kaartviewer',
  templateUrl: './kaartviewer.component.html',
  styleUrls: ['./kaartviewer.component.css']
})
export class KaartviewerComponent implements AfterViewInit {
  public anchorPosition: Position;
  public dialogOpened = false;
  public windowOpened = false;
  tooltip = 'dit is een tekst';
  opened2 = true;
  opened3 = true;
  opened4 = true;
  opened5 = true;
  opened6 = true;

  // SHOW & HIDE
  show1  = false;  show2  = false;  show3  = false;
  show4  = false;  show5  = false;  show6  = false;
  show7  = false;  show8  = false;  show9  = false;
  show10 = false;  show11 = false;  show12 = false;
  show13 = false;  show14 = false;  show15 = false;
  show16 = false;  show17 = false;  show18 = false;
  grenzenvisi = false;             bagvisi = false;
  spoorvisi = false;          dienstenvisi = false;

  // GEOLOCATOR
  public searchInput = '';
  public places = [];
  public collations = [];
  public searchThreshold = 2;
  public foundPlace: any = null;
  public selectedItem = [];
  public selectedIndex = -1;
  // INTERACTIONS FUNCTIONS
  Interactionselect = new Select();
  InteractionTranlate = new Translate({
    features: this.Interactionselect.getFeatures(),
  });
  InteractionTransform;
  // MAP INTERACTIONS
  private map: Map;
  private draw: OlDraw;
  // FORMCONTROLS
  typeSelectTekenen = new FormControl('');
  typeSelectStyle   = new FormControl('');
  kleurschema;
  ColorWheel = 'rgba(255, 255, 255, 0.2)';
  // transform = new transform({});
  // TEKENFUNCTIES
  tekensource = new VectorSource({wrapX: false, });
  tekenfunctie = new VectorLayer({
   source: this.tekensource,
   style: new Style({
   fill: new Fill({color: 'rgba(255, 255, 255, 0.2)'}),
   stroke: new Stroke({color: 'rgba(0, 0, 0, 0.5)', lineDash: [10, 10], width: 2}),
   image: new Circle({radius: 5, stroke: new Stroke({  color: 'rgba(0, 0, 0, 0.7)'}),
   fill: new Fill({color: 'rgba(255, 255, 255, 0.2)'})
    })
   })
  });
  highlightsource = new VectorSource({wrapX: false, });
  highlight = new VectorLayer({
   source: this.highlightsource, style: new Style({fill: new Fill({color: 'pink'}),
   stroke: new Stroke({color: 'Black', width: 3}),
   image: new Circle({radius: 7, fill: new Fill({color: '#ffcc33'})
    })
   })
  });
  // MEET TOOLTIPS
  MeetSource = new VectorSource({});
  MeetLayer = new VectorLayer({
   source: this.MeetSource,
    style: new Style({
    fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
    stroke: new Stroke({color: 'rgba(0, 0, 0, 0.5)', lineDash: [10, 10], width: 2 }),
    image: new Circle({radius: 5, stroke: new Stroke({color: 'rgba(0, 0, 0, 0.7)'}),
    fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)'})
    })
   })
  });
  output;
  sketch;
  measureTooltipElement: HTMLElement;
  tooltipcoord;
  measureTooltip: Overlay;

  // MODIFY THE FEATURE
  Meetmodify = new Modify({source: this.MeetSource});
  modify = new Modify({ source: this.tekensource });
  snap = new Snap({
   source: this.tekensource,
   edge: true,
   vertex: true,
   pixelTolerance: 10
  });
  Meetsnap = new Snap({
   source: this.MeetSource,
   edge: true,
   vertex: true,
   pixelTolerance: 10
  });
  // UNDO-ARRAY
  undoArray = [];
  dataUndoArray = [];
  dataUndoMeetArray = [];
  dataActiveArray = [];
  drawArray = [];
  drawMeetArray = [];
  // GEO ARRAY
  objectarray = [];
  BagArray = [];
  AdresArray = [];
  LayerzIndex = [];
  // REDO-ARRAY
  RedoArray = [];
  dataRedoArray = [];
  // @VIEWCHILD
  @ViewChild('layerControlElement', { static: false }) layerControlElement: ElementRef;
  @ViewChild('PopUpMenu', { static: false }) PopUpMenu: ElementRef;
  @ViewChild('PopUpAdresMenu', { static: false }) PopUpAdresMenu: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  @ViewChild('searchmenu', { static: false }) searchmenu: ElementRef;
  @ViewChild('toolbarmenu', { static: false }) toolbarmenu: ElementRef;
  @ViewChild('dragmenu', { static: false }) dragmenu: ElementRef;
  @ViewChild('drawmenu', { static: false }) drawmenu: ElementRef;
  @ViewChild('droplayermenu', { static: false }) droplayermenu: ElementRef;
  @ViewChild('geosetmenu', { static: false }) geosetmenu: ElementRef;
  // VECTORLAYER
  wmsSource = new TileWMS({
   url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?',
   params: { LAYERS: 'gemeenten', TILED: true },
   serverType: 'geoserver',
   crossOrigin: 'anonymous'
  });
  wmsLayer = new TileLayer({
   source: this.wmsSource,
  });
  UserTile: TileWMS;
  UserLayer: TileLayer;
  mysource;

  constructor(
   private spoorwegService: SpoorwegenService,
   private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
   private adresService: AdresService,
   private bagService: BagService,
   private overigedienstenSerivce: OverigeDienstenService,
   private buttonforlayers: LayerButton,
   private mapconfig: ServiceService,
   private achterkaart: BgService,
   public geocoderService: GeocoderService,
  ) {}
  //
  open2()  { this.opened2 = false; }
  open3()  { this.opened3 = false; }
  open4()  { this.opened4 = false; }
  open5()  { this.opened5 = false; }
  open6()  { this.opened6 = false; }
  //
  close2() { this.opened2 = true; }
  close3() { this.opened3 = true; }
  close4() { this.opened4 = true; }
  close5() { this.opened5 = true; }
  close6() { this.opened6 = true; }
  //

  ngAfterViewInit() {
   this.initializeMap();
   this.addInteraction();
   this.addMeetInteraction();
  }

  initializeMap() { // BEGIN VAN DE MAP MAKEN
   addProjection(this.mapconfig.projection);
   this.map = new Map({ // MAAK DE MAP
    target: 'map',
    layers: [
     // BASELAYERS
     this.achterkaart.baseLayer,
     this.achterkaart.brtWaterLayer,
     this.achterkaart.brtGrijsLayer,
     // BORDERLAYERS
     this.bestuurlijkegrenzenservice.landsgrensLayer,
     this.bestuurlijkegrenzenservice.gemeentenLayer,
     this.bestuurlijkegrenzenservice.provinciesLayer,
     // HOUSELAYERS
     this.bagService.BagLigplaatsLayer,
     this.bagService.BagPandLayer,
     this.bagService.BagVerblijfsobjectLayer,
     this.bagService.BagWoonplaatsLayer,
     this.bagService.BagStandplaatsLayer,
     // ADRESLAYERS
     this.adresService.AdresLayer,
     // OVERIGELAYERS
     this.overigedienstenSerivce.OverheidsdienstenLayer,
     this.overigedienstenSerivce.AgrarischAreaalNederlandLayer,
     this.overigedienstenSerivce.GeografischenamenLayer,
     // TRAINLAYERS
     this.spoorwegService.KruisingLayer,
     this.spoorwegService.OverwegLayer,
     this.spoorwegService.SpoorasLayer,
     this.spoorwegService.StationLayer,
     this.spoorwegService.TraceLayer,
     this.spoorwegService.WisselLayer,
     this.spoorwegService.KilometreringLayer,
     // DRAW FUNCTION
     this.tekenfunctie,
     this.highlight,
     this.MeetLayer,
     ],
     view: this.mapconfig._view,
     controls: [
     new Control({ element: this.PopUpMenu.nativeElement }),
     new Control({ element: this.PopUpAdresMenu.nativeElement }),
     new Control({ element: this.toolbarmenu.nativeElement }),
     new Control({ element: this.dragmenu.nativeElement }),
     new Control({ element: this.drawmenu.nativeElement }),
     new Control({ element: this.droplayermenu.nativeElement }),
     new Control({ element: this.geosetmenu.nativeElement }),
     ]
    });
   this.mapClick();
  }
  ArrayForUndo() { console.log('Array voor undo'); }
  ArrayForRedo() { console.log('Array voor undo'); }
  Settings(event) {console.log('Settings'); }

  createMeasureTooltip() {
  const bottom = 'bottom-right';
  const center = bottom as OverlayPositioning;
  if (this.measureTooltipElement) {
   this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
  }
  this.measureTooltipElement = document.createElement('div');
  this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  this.measureTooltip = new Overlay({
   element: this.measureTooltipElement,
   offset: [0, -15],
   positioning: center,
  });
  this.map.addOverlay(this.measureTooltip);
  }

  // FormatFunctions
  formatLength(line) {
  const length = getLength(line);
  if (length > 100) {
   this.output = (Math.round(length / 1000 * 1000) / 100) + '' + 'km';
  } else {
   this.output = (Math.round(length * 1000) / 100) + '' + 'm';
  }
  return this.output;
  }
  formatArea(polygon) {
  const area = getArea(polygon);
  if (area > 10000) {
   this.output  = (Math.round(area / 1000000 * 100) / 100) + '' + 'km<sup>2</sup>';
  } else {
   this.output = (Math.round(area * 100) / 100) + '' + 'm<sup>2</sup>';
  }
  return this.output;
  }

  addMeetInteraction() {
  const Fillcolor = this.ColorWheel;
  const Drawtype = this.typeSelectTekenen.value;
  if (this.typeSelectTekenen.value !== '') {
  this.draw = new OlDraw({
  source: this.MeetSource,
  type: (Drawtype as GeometryType),
  style: new Style({
   fill: new Fill({
    color:
    'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
    color:
     'rgba(0, 0, 0, 0.5)',
     lineDash: [10, 10],
     width: 2
    }),
   image: new Circle({
    radius: 5,
   stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.7)'
    }),
  fill: new Fill({
   color: 'rgba(255, 255, 255, 0.2)'
     })
    })
   })
  });
  this.map.addInteraction(this.draw);
  this.map.addInteraction(this.Meetsnap);
  this.createMeasureTooltip();

  this.draw.on('drawstart', (evt) => {
   const Meetsketch = evt.feature;
   Meetsketch.getGeometry().on('change', (_event) => {
    evt.feature.setStyle(new Style({
    fill: new Fill({color: Fillcolor}),
    stroke: new Stroke({color:  'rgba(0, 0, 0, 0.5)', width: 3,  lineDash: [10, 10]}),
    image: new Circle({radius: 5, stroke: new Stroke({color: 'yellow'}),
    fill: new Fill({color: 'rgba(255, 255, 255, 0.2)'})
    })
    }));
    const geom = _event.target;
    if (geom instanceof Polygon) {
     this.output = this.formatArea(geom);
     this.tooltipcoord = geom.getInteriorPoint().getCoordinates();
    } else if (geom instanceof LineString) {
     this.output = this.formatLength(geom);
     this.tooltipcoord = geom.getLastCoordinate();
    }
    this.measureTooltipElement.innerHTML = this.output;
    this.measureTooltip.setPosition(this.tooltipcoord);
   });
  });

  this.draw.on('drawend', (event) => {
   this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
   this.measureTooltip.setOffset([0, -7]);
   this.sketch = null;
   this.measureTooltipElement = null;
   this.createMeasureTooltip();
   this.drawMeetArray.push(event.feature);
   console.log(event.feature);
    });
   }
  }

  EnableInteractions(event) {
  console.log(event);
  if (event === 'snap') {
   console.log('SNISNA');
   this.map.addInteraction(this.snap);
   this.map.addInteraction(this.Meetsnap);
  }
  if (event === 'modify') {
  console.log('modimodimodi');
  }
  if (event === '') {
   this.map.removeInteraction(this.snap);
   this.map.removeInteraction(this.Meetsnap);
   console.log('AZSDRTRFGYUHJKL;JDVFXCGVHBJKL;');
  } else {
  console.log('else');
  }
  }

  switchMeetMode(event: GeometryType) {
  if (event === 'LineString' || event === 'Polygon') {
   this.typeSelectTekenen.setValue(event);
  } else {
   this.typeSelectTekenen.setValue('');
  }
  this.map.removeInteraction(this.draw);
  this.addMeetInteraction();
  }

  mapClick() {
  this.map.on('singleclick', (evt) => {
  const viewResolution = this.mapconfig._view.getResolution();
  this.map.forEachLayerAtPixel(evt.pixel, (layer) => {
  const source = layer.getSource();

  if ((source as any).getLegendUrl) {
  const legenda = (source as any).getLegendUrl(
  viewResolution, { FORMAT: 'image/png'});
  console.log(legenda);

  if (legenda) {
  this.mysource = legenda;
  }

  if ((source as any).getFeatureInfoUrl) {
  const url = (source as any).getFeatureInfoUrl(
  evt.coordinate, viewResolution, 'EPSG:28992', { INFO_FORMAT: 'application/json' });


  if (url) {
  fetch(url).then((response) => {
  response.json().then((geojsonData) => {
  const features = new GeoJSON({dataProjection: 'EPSG:28992', featureProjection: 'EPSG:28992'}).readFeatures(geojsonData);
  const Bagname = features[0].get('bouwjaar');
  const Adresnaam = features[0].get('huisnummer');

  if (Adresnaam) {
  const pushNewFeature = features[0].getProperties();
  const index = this.AdresArray.findIndex(x => x === pushNewFeature);
  this.AdresArray.splice(index, 1);
  this.AdresArray.push(pushNewFeature);
  this.open5();
  console.log(features[0].getProperties());
  console.log(Adresnaam);
  }

  if (Bagname) {
  const pushNewFeature = features[0].getProperties();
  const index = this.BagArray.findIndex(x => x === pushNewFeature);
  this.BagArray.splice(index, 1);
  this.BagArray.push(pushNewFeature);
  this.highlightsource.clear();
  this.highlightsource.addFeature(features[0]);
  this.open4();
  console.log(features[0].getProperties());
  console.log(Bagname);
  } else {

  if (features[0]) {
  // document.getElementById('provincienaam').innerHTML = features[0].get('provincienaam');
  // console.log(features[0].getProperties());
  const pushNewFeature = features[0].getProperties();
  const index = this.objectarray.findIndex(x => x === pushNewFeature);
  this.objectarray.splice(index, 1);
  this.objectarray.push(pushNewFeature);
  this.highlightsource.clear();
  this.highlightsource.addFeature(features[0]);
        }}
       });
      });
     }}
    }
    });
   });
  }
  AddLayer(event) {
  const NewLayerTitle = event;
  this.UserTile = new TileWMS({
  params: { LAYERS: NewLayerTitle, TILED: true, title: NewLayerTitle },
  crossOrigin: 'anonymous',
  });
  this.UserLayer = new TileLayer({
  source: this.UserTile,
  title: NewLayerTitle,
  visible: true,
  } as ITileOptions);

  if (NewLayerTitle === 'lfroutes')  {
  this.UserTile.setUrl('https://geodata.nationaalgeoregister.nl/lfroutes/wms?');
  this.map.addLayer(this.UserLayer);
  return this.UserLayer;
  }
  if (NewLayerTitle === 'bbg2015' || NewLayerTitle === 'BBG2015_hoofdgroep')  {
  this.UserTile.setUrl('https://geodata.nationaalgeoregister.nl/bestandbodemgebruik2015/wms?');
  this.map.addLayer(this.UserLayer);
  }
  if (NewLayerTitle === 'bevolkingskernen2011:cbsbevolkingskernen2011')  {
  this.UserTile.setUrl('https://geodata.nationaalgeoregister.nl/bevolkingskernen2011/wms?');
  this.map.addLayer(this.UserLayer);
  }
  if (NewLayerTitle === 'weggegaantalrijbanen' || NewLayerTitle === 'weggegmaximumsnelheden')  {
  this.UserTile.setUrl('https://geodata.nationaalgeoregister.nl/weggeg/wms?');
  this.map.addLayer(this.UserLayer);
  }
  if (NewLayerTitle === 'bevolkingskernen2011:cbsbevolkingskernen2011')  {
  this.UserTile.setUrl('https://geodata.nationaalgeoregister.nl/bevolkingskernen2011/wms?');
  this.map.addLayer(this.UserLayer);
    }
  }
  addInteraction() {
  const Fillcolor = this.ColorWheel;
  const value = this.typeSelectTekenen.value;
  if (value !== '') {
   this.map.removeInteraction(this.snap);
   this.draw = new OlDraw({source: this.tekensource, type: value, });
   this.draw.on('drawend', (event) => {
    event.feature.setStyle(new Style({
    fill: new Fill({color: Fillcolor}),
    stroke: new Stroke({color: 'Red', width: 3}),
    image: new Circle({radius: 5, stroke: new Stroke({color: 'yellow'}),
    fill: new Fill({color: 'rgba(255, 255, 255, 0.2)'})
    })
    }));
    this.drawArray.push(event.feature);
   });
   this.map.addInteraction(this.draw);
   this.map.addInteraction(this.snap);
   }
  }
  switchDrawMode(event) {
  if (event !== '') {
   this.typeSelectTekenen.setValue(event);
  } else {
   this.typeSelectTekenen.setValue('');
  }
  this.map.removeInteraction(this.draw);
  this.addInteraction();
  }

  StyleColorSwitch(Stylevent) {
  this.map.removeInteraction(this.draw);
  if (Stylevent) {
   this.typeSelectStyle.setValue(Stylevent);
   this.ColorWheel = Stylevent;
   this.addInteraction();
   this.tekenfunctie.changed();
   }
  }
  styleswitchDialog(Stylevent?: string | null) {
  this.map.removeInteraction(this.draw);
  if (Stylevent) {
   this.kleurschema = Stylevent;
   this.typeSelectStyle.setValue(Stylevent);
   this.tekenfunctie.changed();
   this.addInteraction();
   this.tekenfunctie.changed();
   }
  }

  // UNDO & REDO FUNCTIONS
  UndoButton() {
   this.undoArray = this.tekensource.getFeatures();
   const lastFeatureUndo = this.undoArray.pop();
   this.dataUndoArray.push(lastFeatureUndo);
   this.tekensource.removeFeature(lastFeatureUndo);
  }
  RedoButton() {
   this.RedoArray = this.dataUndoArray;
   const lastFeature = this.RedoArray.pop();
   this.dataRedoArray.push(lastFeature);
   this.tekensource.addFeature(lastFeature);
  }
  select(event) {
   this.map.removeInteraction(this.draw);
   this.map.removeInteraction(this.Interactionselect);
   this.map.removeInteraction(this.InteractionTranlate);
   this.map.removeInteraction(this.InteractionTransform);
  }
  transform(event) {
  this.InteractionTransform = new Transform({
   rotate: true,
   scale: true,
   translate: true,
   noFlip: true,
   stretch: true,
   translateFeature: true,
   });
  this.map.addInteraction(this.InteractionTransform);
  }
  onPlaceFound(place) {
  this.map.getView().animate({center: place.centroide_rd.coordinates, zoom: 12});
  console.log(place);
  }
}

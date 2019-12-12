import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ɵConsole} from '@angular/core';
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
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { style } from '@angular/animations';
import { color, source, interaction } from 'openlayers';

@Component({
  selector: 'app-kaartviewer',
  templateUrl: './kaartviewer.component.html',
  styleUrls: ['./kaartviewer.component.css']
})
export class KaartviewerComponent implements AfterViewInit {
  show1  = false;  show2  = false;  show3  = false;
  show4  = false;  show5  = false;  show6  = false;
  show7  = false;  show8  = false;  show9  = false;
  show10 = false;  show11 = false;  show12 = false;
  show13 = false;  show14 = false;  show15 = false;
  grenzenvisi = false;             bagvisi = false;
  spoorvisi = false;          dienstenvisi = false;

  public searchInput = '';
  public places = [];
  public collations = [];
  public searchThreshold = 2;
  public foundPlace: any = null;
  public selectedItem = [];
  public selectedIndex = -1;

  private map: Map;
  private draw: OlDraw;
  Undofeatures;
  UndolastFeature;

  typeSelectTekenen = new FormControl('');
  typeSelectStyle   = new FormControl('');

  tekensource = new VectorSource({wrapX: false, });
  tekenfunctie = new VectorLayer({source: this.tekensource, style: new Style({fill: new Fill({color: 'blue'}) }) });

  @ViewChild('layerControlElement', { static: false }) layerControlElement: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  @ViewChild('searchmenu', { static: false }) searchmenu: ElementRef;
  @ViewChild('toolbarmenu', { static: false }) toolbarmenu: ElementRef;


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
    console.log(this.tekenfunctie);
  }
  initializeMap() { // BEGIN VAN DE MAP MAKEN

    this.map = new Map({ // MAAK DE MAP
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
      view: this.mapconfig._view,
      controls: [
        new Control({ element: this.toolbarmenu.nativeElement }),
      ]
    });
   } // EINDE VAN DE MAP MAKEN




  addInteraction() {
    const value = this.typeSelectTekenen.value;
    const getValue = this.typeSelectStyle.value;
    console.log(getValue + 'interaction');
    if (value !== '') {
      this.draw = new OlDraw({
        source: this.tekensource,
        type: value,
      });
      this.draw.on('drawend', (event) => {
        event.feature.setStyle(new Style({
          fill: new Fill({color: getValue}),
          stroke: new Stroke({color: 'Black', width: 3}),
          image: new Circle({
           radius: 7,
           fill: new Fill({color: 'green'})
         })
        }));
      });
      console.log(this.draw);
      console.log(this.tekenfunctie.getLayersArray() );
      this.map.addInteraction(this.draw);
    }
  }
  switchMode(event?: string | null) {
    if (event !== '') {
      this.typeSelectTekenen.setValue(event);
    } else {
      this.typeSelectTekenen.setValue('');
    }
    this.map.removeInteraction(this.draw);
    this.addInteraction();
  }

  styleswitch(Stylevent?: string | null) {
    this.map.removeInteraction(this.draw);
    if (Stylevent !== '') {
      this.typeSelectStyle.setValue(Stylevent);
      this.tekenfunctie.changed();

    } else {
      this.typeSelectStyle.setValue('');
      this.tekenfunctie.changed();
    }
    console.log(Stylevent + '' + 'styleswitch');
    this.map.removeInteraction(this.draw);
    this.addInteraction();
    this.tekenfunctie.changed();
  }


  // UNDO & REDO FUNCTIONS
  UndoButton() {
    console.log('klikkerdeklik');
    this.Undofeatures = this.tekensource.getFeatures();
    this.UndolastFeature = this.Undofeatures[this.Undofeatures.length - 1];
    this.tekensource.removeFeature(this.UndolastFeature);
    console.log(this.Undofeatures);
  }
  RedoButton() {
    // const features = this.tekensource.getFeatures();
    // const lastFeature = features[features.length - 1];
    // this.tekensource.removeFeature(lastFeature);
    // console.log('je hebt op de knop geklikt');
    // console.log('maak een unieke id aan of probeer met de value iets aan te geven, of zet alles in een array');
    // console.log(this.tekenfunctie.getLayersArray());
    // console.log(this.tekenfunctieBlue.getLayersArray());
    // console.log(this.tekenfunctieRed.getLayersArray());
    // console.log(this.tekenfunctieGreen.getLayersArray());
    // console.log(this.map.getLayerGroup().getType());
    const laag = this.map.getLayers().getArray();
    const laag1 = this.map.getLayers().getArray().length.toLocaleString();
    console.log(laag);
    console.log(laag1);
  }

  // SAVE FUNCTIE
  save() {}

  // ZOOM IN FUNCTIE
  zoom_in() {
    const currentZoom = this.map.getView().getZoom();
    this.map.getView().animate({ zoom: currentZoom + 1, duration: 250 });
   }
  // ZOOM OUT FUNCTIE
  zoom_out() {
    const currentZoom = this.map.getView().getZoom();
    this.map.getView().animate({ zoom: currentZoom - 1, duration: 250 });
  }

  // GEOLOCATOR
  public onPlaceFound(place) {
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
  getButtonColorBlue(Buttonevent?: string | null) {
    const getFeatures = this.tekenfunctie.getSource().getFeatures();
    const getFeaturesId = this.tekenfunctie.getSource().getFeatures().length + 0;
    const recente = getFeatures[getFeatures.length - 1];
    const geo1 = recente.getGeometry();
    const geo2 = recente.getGeometryName();
    console.log(getFeatures);
    console.log(getFeaturesId);
    console.log(recente);
    console.log(geo1);
    console.log(geo2);
    // this.tekensource.removeFeature(lastFeature2);
    this.tekenfunctie.setStyle(new Style({
      fill: new Fill({color: 'blue'}), stroke: new Stroke({width: 3, color: 'pink'}) }) );
    // console.log('blue');
    this.tekensource.changed();

  }

  getButtonColorGreen(Buttonevent?: string | null) {
    // this.tekensource.clear();
    this.tekenfunctie.setStyle(new Style({
      fill: new Fill({color: 'Green'}), stroke: new Stroke({width: 3, color: 'red'})
    }) );
    // const features = this.tekensource.getFeatures();
    // const lastFeature = features[features.length - 1];
    // lastFeature.setStyle(new Style({fill: new Fill({color: 'Green'}) }) );
    // console.log(lastFeature);
    console.log('Green');
  }
  getButtonColorRed(Buttonevent?: string | null) {
    console.log('Red');
    this.tekenfunctie.setStyle(new Style({
      fill: new Fill({color: 'Red'}), stroke: new Stroke({width: 3, color: 'yellow'})
    }) );
  }



} // EINDE VAN DE COMPONENT NG ONINIT

// if (this.typeSelectStyle.value === 'blue') {
//   console.log('BLAUUWUWWUUWW');
//   this.tekenfunctie.setStyle (new Style({
//     fill: new Fill({color: 'pink'}),
//     stroke: new Stroke({color: 'Black', width: 3}),
//     image: new Circle({
//      radius: 7,
//      fill: new Fill({color: 'green'})
//    }) }) );
// } else {
//   console.log('FOUT');
// }

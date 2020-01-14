import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ɵConsole, Output, EventEmitter } from '@angular/core';
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
import { OSM, Vector as VectorSource, TileJSON, ImageWMS } from 'ol/source';
import { Icon, Stroke, Style, Fill, Circle} from 'ol/style';
import LocationSuggestData from '../_interfaces/_datainterface/location-suggest-data-interface';
import { BestuurlijkegrenzenService } from '../layers/bestuurlijkegrenzen.service';
import { BagService } from '../layers/bag.service';
import GeoJSON from 'ol/format/GeoJSON';
import { SpoorwegenService, ITileOptions } from '../layers/spoorwegen.service';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap, Zoom} from 'ol/control';

import { OverigeDienstenService } from '../layers/overigediensten.service';
import {defaults as defaultInteractions, Modify, Snap, Draw } from 'ol/interaction';
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
import {click, pointerMove, altKeyOnly, singleClick} from 'ol/events/condition';
import Select, { SelectEvent } from 'ol/interaction/Select';
import { transformExtent, addProjection,  } from 'ol/proj';
import { transformGeom2D } from 'ol/geom/SimpleGeometry';
import ImageLayer from 'ol/layer/Image';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
import Translate from 'ol/interaction/Translate';
import Transform from 'ol-ext/interaction/transform';
import TileSource from 'ol/source/Tile';

@Component({
  selector: 'app-kaartviewer',
  templateUrl: './kaartviewer.component.html',
  styleUrls: ['./kaartviewer.component.css']
})
export class KaartviewerComponent implements AfterViewInit {
  // SHOW & HIDE
  show1  = false;  show2  = false;  show3  = false;
  show4  = false;  show5  = false;  show6  = false;
  show7  = false;  show8  = false;  show9  = false;
  show10 = false;  show11 = false;  show12 = false;
  show13 = false;  show14 = false;  show15 = false;
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
  // SELECT FUNCTIONS
  Arrow = new Select();
  // MAP INTERACTIONS
  private map: Map;
  private draw: OlDraw;
  // FORMCONTROLS
  typeSelectTekenen = new FormControl('');
  typeSelectStyle   = new FormControl('');
  kleurschema;
  translate = new Translate({});
  // transform = new transform({});
  // TEKENFUNCTIES
  tekensource = new VectorSource({wrapX: false, });
  tekenfunctie = new VectorLayer({
    source: this.tekensource, style: new Style({fill: new Fill({color: 'yellow'}),
     stroke: new Stroke({color: 'Black', width: 3}),
     image: new Circle({radius: 7, fill: new Fill({color: '#ffcc33'})
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

  // UNDO-ARRAY
  undoArray = [];
  dataUndoArray = [];
  dataActiveArray = [];
  drawArray = [];
  objectarray = [];
  // currentData = this.dataUndoArray;
  // currentData = this.dataUndoArray;
  // REDO-ARRAY
  RedoArray = [];
  dataRedoArray = [];
  // @OUTPUT
  // @VIEWCHILD
  @ViewChild('layerControlElement', { static: false }) layerControlElement: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  @ViewChild('searchmenu', { static: false }) searchmenu: ElementRef;
  @ViewChild('toolbarmenu', { static: false }) toolbarmenu: ElementRef;
  @ViewChild('dragmenu', { static: false }) dragmenu: ElementRef;
  @ViewChild('drawmenu', { static: false }) drawmenu: ElementRef;
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
      ],
      view: this.mapconfig._view,
      controls: [
        new Control({ element: this.toolbarmenu.nativeElement }),
        new Control({ element: this.dragmenu.nativeElement }),
        new Control({ element: this.drawmenu.nativeElement }),
        new Control({ element: this.geosetmenu.nativeElement }),
      ]
    });
    this.mapClick();
   } // EINDE VAN DE MAP MAKEN

   // OUTPUT RETURN
   ArrayForUndo() { console.log('Array voor undo'); }
   ArrayForRedo() { console.log('Array voor undo'); }

   checkforupdate() {
    // const f = this.tekensource.getFeatures(); const l = f.pop(); this.dataActiveArray.push(l);
    // const p = l.getProperties(); console.log(p);
    const s = this.tekenfunctie.getSource();
    const f = s.getFeatures();
    const p = f.pop();
    const pr = p;

    console.log(pr);

   }
   mapClick() {
    this.map.on('singleclick', (evt) => {
     const viewResolution = this.mapconfig._view.getResolution();
     this.map.forEachLayerAtPixel(evt.pixel, (layer) => {
      const source = layer.getSource();

      if ((source as any).getFeatureInfoUrl) {
       const url = (source as any).getFeatureInfoUrl(
        evt.coordinate, viewResolution, 'EPSG:28992', { INFO_FORMAT: 'application/json' } );

       if (url) {
        fetch(url).then((response) => {
        response.json().then((geojsonData) => {
        const features = new GeoJSON({dataProjection: 'EPSG:28992', featureProjection: 'EPSG:28992'}).readFeatures(geojsonData);

        if (features[0]) {
        const pushNewFeature = features[0].getProperties();
        console.log(features[0].getProperties());
        document.getElementById('provincienaam').innerHTML = features[0].get('provincienaam');
        // const pushFeature2 = document.getElementById('provincienaam').innerHTML = features[0].get('provincienaam');

        const index = this.objectarray.findIndex(x => x === pushNewFeature);
        this.objectarray.splice(index, 1);
        this.objectarray.push(pushNewFeature);


        this.highlightsource.clear();
        this.highlightsource.addFeature(features[0]);

        } }); }); } } }); });
   }


   testvoordemap() {
    this.map.on('singleclick', (evt) => {
      fetch('https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wfs?&GetFeature&typeName=provincies').then((response) => {
        return response.text(); }).then((response) => {
          // TO READ ALL THE FEATURES
        const allFeatures = new WMSGetFeatureInfo().readFeatures(response);
        document.getElementById('all').innerText = allFeatures.length.toString();
        });
    });
   }
  openDialog() {}

  popup() {
    if (click) {
     console.log('NICE');
    } else {
      console.log('ELSE');
    }
  }

  addInteraction() {
    const schema = this.kleurschema;
    const value = this.typeSelectTekenen.value;
    const getValue = this.typeSelectStyle.value;
    // console.log(getValue + 'interaction');
    if (value !== '') {
      this.draw = new OlDraw({
       source: this.tekensource,
       type: value,
      });
      this.draw.on('drawend', (event) => {
       event.feature.setStyle(new Style({
        fill: new Fill({color: schema}),
        stroke: new Stroke({color: 'Black', width: 3}),
        image: new Circle({radius: 7,
        fill: new Fill({color: 'green'})
        })
       }));
       this.drawArray.push(event.feature);
      });
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

  styleswitchDialog(Stylevent?: string | null) {
    this.map.removeInteraction(this.draw);
    if (Stylevent) {console.log(Stylevent); }
    this.kleurschema = Stylevent;
    this.typeSelectStyle.setValue(Stylevent);
    this.tekenfunctie.changed();

    this.addInteraction();
    this.tekenfunctie.changed();
  }

  // UNDO & REDO FUNCTIONS
  UndoButton() {
   // (STAP 1) ZET ALLE FEATURES IN DE UNDO-ARRAY
   this.undoArray = this.tekensource.getFeatures();
   // (STAP 2) PAK DE LAATST GETEKENDE FEATURE
   const lastFeatureUndo = this.undoArray.pop();
   // PUSH ALLE GETEKENDE FEATURES NAAR DE DATA-ARRAY
   this.dataUndoArray.push(lastFeatureUndo);
   // REMOVE DE GETEKENDE FEATURE
   this.tekensource.removeFeature(lastFeatureUndo);
   console.log(this.undoArray);
  }
  RedoButton() {
   // (STAP 1) ZET ALLE FEATURES IN DE UNDO-ARRAY
   this.RedoArray = this.dataUndoArray;
   // (STAP 2) PAK DE LAATST GETEKENDE FEATURE
   const lastFeature = this.RedoArray.pop();
   // (STAP 3) PUSH ALLE VERWIJDERDE FEATURES NAAR DE DATA-REDO-ARRAY
   this.dataRedoArray.push(lastFeature);
   // (STAP 4) VOEG DE VERWIJDERDE FEATURES TOE
   this.tekensource.addFeature(lastFeature);
  }
  // SELECT BUTTON
  // select interaction
  displayFeatureInfo() {
   const getVis = this.bestuurlijkegrenzenservice.provinciesLayer.getVisible();
   this.map.on('click', (evt) => {
    if (getVis === false ) {
      console.log(this.bestuurlijkegrenzenservice.provinciesLayer.getProperties());
      console.log(this.bestuurlijkegrenzenservice.provinciesLayer.getSource());
      console.log( this.bestuurlijkegrenzenservice.provinciesTile.getUrls());
     } else {
       this.bestuurlijkegrenzenservice.gemeentenLayer.setVisible(true);
      //  this.bestuurlijkegrenzenservice.provinciesLayer.on();

       }
   });
  }

  select() {
    const translate = new Translate({features: this.Arrow.getFeatures() });
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(translate);
    this.map.removeInteraction(this.Arrow);
   }
   // TRANSFORM SELECT FUNCTIE MAKEN EN COMPONENT AAN MAKEN DIE CHECKT WELKE
   // SERVICE LAYERS EN SOURCE VAN DE KAARTLAGEN UIT EN STAAN OM ZO DE FEATURES MEE TEN GEVEN

   transformFunction() {
    const SelectFeature = new Select({condition: click});
    this.map.addInteraction(SelectFeature);
    console.log('transform');
    }
    setHandleStyle() {}
   translateFunction() {console.log('translate'); }

  // SAVE FUNCTIE
  save() {}

  // ZOOM IN FUNCTIE
  zoom_in() {
    const currentZoom = this.map.getView().getZoom();
    this.map.getView().animate({ zoom: currentZoom + 1, duration: 250 });
    console.log(this.map.getProperties());
   }
  // ZOOM OUT FUNCTIE
  zoom_out() {
    const currentZoom = this.map.getView().getZoom();
    this.map.getView().animate({ zoom: currentZoom - 1, duration: 250 });
  }

  // GEOLOCATOR SEARCH PLACE
  public onPlaceFound(place) {
    this.map.getView().animate({center: place.centroide_rd.coordinates, zoom: 12});
  }
  Info(event) {
    console.log('info');
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

  }
  getButtonColorRed(Buttonevent?: string | null) {
    console.log('Red');
    this.tekenfunctie.setStyle(new Style({
      fill: new Fill({color: 'Red'}), stroke: new Stroke({width: 3, color: 'yellow'})
    }) );
  }
} // EINDE VAN DE COMPONENT NG ONINIT

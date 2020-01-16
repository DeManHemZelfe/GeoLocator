import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, ɵConsole, Output, EventEmitter, Input } from '@angular/core';
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
import OlDraw, { DrawEvent } from 'ol/interaction/Draw';
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
import {defaults as defaultInteractions, Modify, Snap, Draw} from 'ol/interaction';
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
import {click, pointerMove, altKeyOnly, singleClick, doubleClick} from 'ol/events/condition';
import Select, { SelectEvent } from 'ol/interaction/Select';
import { transformExtent, addProjection,  } from 'ol/proj';
import { transformGeom2D } from 'ol/geom/SimpleGeometry';
import ImageLayer from 'ol/layer/Image';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
import Translate from 'ol/interaction/Translate';
import Transform from 'ol-ext/interaction/transform';
import TileSource from 'ol/source/Tile';


import { Polygon, LineString, Geometry } from 'ol/geom';
import {getArea, getLength} from 'ol/sphere';
import GeometryType from 'ol/geom/GeometryType';

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
  // MEET TOOLTIPS
  MeetSource = new VectorSource({});
  MeetLayer = new VectorLayer({
    source: this.MeetSource,
    style: new Style({
     fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
     stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.5)', lineDash: [10, 10], width: 2 }),
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
  output;
  sketch;
  measureTooltipElement: HTMLElement;
  tooltipcoord;
  measureTooltip: Overlay;
  // UNDO-ARRAY
  undoArray = [];
  dataUndoArray = [];
  dataActiveArray = [];
  drawArray = [];
  // currentData = this.dataUndoArray;
  // currentData = this.dataUndoArray;
  // GEO ARRAY
  objectarray = [];
  BagArray = [];
  LayerzIndex = [];
  // REDO-ARRAY
  RedoArray = [];
  dataRedoArray = [];
  // @OUTPUT
  // @VIEWCHILD
  @ViewChild('layerControlElement', { static: false }) layerControlElement: ElementRef;
  @ViewChild('PopUpMenu', { static: false }) PopUpMenu: ElementRef;
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

   // Tooltip (openlayers codesandbox)
   createMeasureTooltip() {
     if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
     }
     this.measureTooltipElement = document.createElement('div');
     this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
     const bottom = 'bottom-right';
     const center = bottom as OverlayPositioning;
     this.measureTooltip = new Overlay({
       element: this.measureTooltipElement,
       offset: [0, -15],
       positioning: center,
     });
     this.map.addOverlay(this.measureTooltip);
   }

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
      this.output  = (Math.round(area / 1000000 * 100) / 100) +
       '' + 'km<sup>2</sup>';
     } else {
      this.output = (Math.round(area * 100) / 100) + '' + 'm<sup>2</sup>';
     }
     return this.output;
   }

   addMeetInteraction() {
    const schema = this.kleurschema;
    if (this.typeSelectTekenen.value !== '') {
     const Drawtype = this.typeSelectTekenen.value;
     this.draw = new OlDraw({
      source: this.MeetSource,
      type: (Drawtype as GeometryType),
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
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
     this.createMeasureTooltip();

     this.draw.on('drawstart', (event) => {
      const Meetsketch = event.feature;
      Meetsketch.getGeometry().on('change', (_event) => {
        const geom = _event.target;
        console.log(geom);

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
      // this.drawArray.push(event.feature);
     });
     }
   }
  switchMeetMode(event: GeometryType) {
  //  console.log(event);
   if (event === 'LineString' || event === 'Polygon') {
     this.typeSelectTekenen.setValue(event);
   } else {
     this.typeSelectTekenen.setValue('');
   }
   this.map.removeInteraction(this.draw);
  //  this.map.removeInteraction(this.measureTooltip);
   this.addMeetInteraction();
  }

   Settings(event) {
     console.log('Settings');
   }
   checkforupdate() {
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
       evt.coordinate, viewResolution, 'EPSG:28992', { INFO_FORMAT: 'application/json' });

       if (url) {
        fetch(url).then((response) => {
         response.json().then((geojsonData) => {
          const features = new GeoJSON({dataProjection: 'EPSG:28992', featureProjection: 'EPSG:28992'}).readFeatures(geojsonData);
          const Bagname = features[0].get('bouwjaar');

          if (Bagname) {
           const pushNewFeature = features[0].getProperties();
           const index = this.BagArray.findIndex(x => x === pushNewFeature);
           this.BagArray.splice(index, 1);
           this.BagArray.push(pushNewFeature);
           console.log(features[0].getProperties());
           console.log(Bagname);
          } else {

          if (features[0]) {
           document.getElementById('provincienaam').innerHTML = features[0].get('provincienaam');
           console.log(features[0].getProperties());

           const pushNewFeature = features[0].getProperties();
           const index = this.objectarray.findIndex(x => x === pushNewFeature);
           this.objectarray.splice(index, 1);
           this.objectarray.push(pushNewFeature);

           this.highlightsource.clear();
           this.highlightsource.addFeature(features[0]);
            }
           }
          });
         });
        }
       }
      });
     });
    }
  addInteraction() {
    const schema = this.kleurschema;
    const value = this.typeSelectTekenen.value;
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
  switchDrawMode(event) {
    // console.log(event);
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
    // this.map.addInteraction(this.Interactionselect);
    this.map.addInteraction(this.InteractionTransform);
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

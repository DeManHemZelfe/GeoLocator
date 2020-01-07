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
import { color, source, interaction, coordinate } from 'openlayers';
import {click, pointerMove, altKeyOnly, singleClick} from 'ol/events/condition';
import Select, { SelectEvent } from 'ol/interaction/Select';
import { transformExtent, addProjection, transform } from 'ol/proj';
import { transformGeom2D } from 'ol/geom/SimpleGeometry';
import ImageLayer from 'ol/layer/Image';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
import Translate from 'ol/interaction/Translate';



// localstorage. (remove)
// JWT
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
  // TEKENFUNCTIES
  tekensource = new VectorSource({wrapX: false, });
  tekenfunctie = new VectorLayer({
    source: this.tekensource, style: new Style({fill: new Fill({color: 'yellow'}),
     stroke: new Stroke({color: 'Black', width: 3}),
     image: new Circle({radius: 7, fill: new Fill({color: '#ffcc33'})
     })
    })
  });

  // UNDO-ARRAY
  undoArray = [];
  dataUndoArray = [];
  // currentData = this.dataUndoArray;
  // currentData = this.dataUndoArray;
  // REDO-ARRAY
  RedoArray = [];
  dataRedoArray = [];

  child1: {futbols: Array<boolean>, name: string, id: number} = {
    futbols: [true, true, true, true, true],
    name: 'Child 1',
    id: 1
  };
  child2: {futbols: Array<boolean>, name: string, id: number} = {
    futbols: [true, true, true, true],
    name: 'Child 2',
    id: 2
  };

  // @OUTPUT
  // @Output() _afu: EventEmitter<any> = new EventEmitter<any>();
  // @Output() _afr: EventEmitter<any> = new EventEmitter<any>();
  currentItem = 'Television';
  // @VIEWCHILD
  @ViewChild('layerControlElement', { static: false }) layerControlElement: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  @ViewChild('searchmenu', { static: false }) searchmenu: ElementRef;
  @ViewChild('toolbarmenu', { static: false }) toolbarmenu: ElementRef;
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
        // this.achterkaart.brtWaterLayer,
        // this.achterkaart.brtGrijsLayer,
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
        // this.wmsLayer,
      ],
      view: this.mapconfig._view,
      controls: [
        new Control({ element: this.toolbarmenu.nativeElement }),
        // new Control({ element: this.toolbarmenu.nativeElement }),
        // new Control({ element: this.toolbarmenu.nativeElement }),
      ]
    });
   } // EINDE VAN DE MAP MAKEN

   // OUTPUT RETURN
   ArrayForUndo() { console.log('Array voor undo'); }
   ArrayForRedo() { console.log('Array voor undo'); }

   mapClick() {
    this.map.on('singleclick', (evt) => {
      const viewResolution = this.mapconfig._view.getResolution();
      const getVis = this.bestuurlijkegrenzenservice.provinciesLayer.getVisible();
      const url = (this.bestuurlijkegrenzenservice.provinciesTile as any).getFeatureInfoUrl(
        evt.coordinate, viewResolution, 'EPSG:28992', { INFO_FORMAT: 'text/html' } );
      if (getVis === true) {
        if (url) {
           const veggie = fetch(url).then((response) => {
            response.text().then((html) => {
            document.getElementById('provincienaam').innerHTML = html;
            console.log('test');
          });
        });
           console.log(veggie); }
      }
    });
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
      });
      // console.log(this.draw);
      // console.log(this.tekenfunctie.getLayersArray() );
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
  getMapFeatures() {
    const BaseArray = [];
    const numb1 = this.dataUndoArray;
    const numb2 = this.tekensource.getFeatures();

    BaseArray.push(numb1);
    BaseArray.push(numb2);


    console.log('Base Array', '', BaseArray);
    console.log('Data Undo' , '' , this.dataUndoArray);
    console.log('TekenSource' , '' , this.tekensource.getFeatures());
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

   transform() {
    console.log('translate');
   }

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



// UNDOREDO FUNCTION (JAVASCRIPT)
// /**
//  * Class: UndoRedo
//  * Instance of this class can be used to undo and redo vector edits.
//  */
// UndoRedo = OpenLayers.Class(OpenLayers.Contorl,{
// 	/**
// 	 * APIProperty: currentEditIndex
// 	 * {integer} - sequence number for editing the feature[s]
// 	 */
// 	currentEditIndex: 0,
// 	/**
// 	 * Property: undoFeatures
// 	 * {array} - stack of the edit features
// 	 */
// 	undoFeatures: [],
// 	/**
// 	 * Property: redoFeatures
// 	 * {array} - stack of the undo features
// 	 */
// 	redoFeatures: [],
// 	/**
// 	 * Property: isEditMulty
// 	 * {boolean} - true if in one action multiple features are editied
// 	 */
// 	isEditMulty: false,

// 	/**
// 	 * Constructor: UndoRedo
// 	 * Parameters:
// 	 * layers - array of {<OpenLayers.Layers.Vector>}
// 	 */
// 	initialize: function(layers){
// 		if (!(layers instanceof Array)) {
// 			layers = [layers];
// 		}
// 		for(var i=0;i<layers.length; i++){
// 			layers[i].events.register("featureadded",this,this.onInsert);
//             layers[i].events.register("beforefeatureremoved",this,this.onDelete);
//             layers[i].events.register("beforefeaturemodified",this,this.onUpdate);
// 		}
// 	},
// 	/**
// 	 * Method: onEdit
// 	 * on any edit operation performed this has to be triggred
// 	 * i.e. on insert, delete, update
// 	 * Parameters:
// 	 * feature - {<OpenLayers.Feature.Vector>}
// 	 * editType - {string} edit type done "Insert","Delete","Update"
// 	 * component - {string} layer or any other identifier
// 	 * Returns:
// 	 */
// 	onEdit: function(feature,editType,component){
// 		//console.log("Updating undo stack as there is - "+editType);
// 		if (component == undefined){
// 			component = feature.layer.name;
// 		}
// 		if (this.undoFeatures[this.currentEditIndex] == undefined) {
// 			this.undoFeatures[this.currentEditIndex] = {};
// 			this.undoFeatures[this.currentEditIndex][component] = {"Insert":[],"Update":[],"Delete":[]};
// 		}
// 		if(feature.fid == undefined){
// 			feature.fid = feature.id;
// 		}
// 		this.undoFeatures[this.currentEditIndex][component][editType].push(feature);
// 		this.redoFeatures.splice(0,this.redoFeatures.length);
// 		//run increase editIndex outside after this in case of multy feature edit
// 		if(!this.isEditMulty){
// 			this.setEditIndex();
// 		}
// 	},

// 	/**
// 	 * Method: onInsert
// 	 * event haldler for featureadded
// 	 */
// 	onInsert: function(event){
// 		//onEdit(event.feature,"Insert",event.feature.layer.name);
// 		feature = event.feature.clone();
// 		if(event.feature.fid == undefined) {
// 			event.feature.fid = event.feature.id;
// 		}
// 		feature.fid = event.feature.fid;
// 		feature.state = event.feature.state;
// 		feature.layer = event.feature.layer;
// 		this.onEdit(feature,"Insert",feature.layer.name);
// 	},

// 	/**
// 	 * Method: onDelete
// 	 * event haldler for beforefeatureremoved
// 	 */
// 	onDelete: function(event){
// 		this.onEdit(event.feature,"Delete",event.feature.layer.name);
// 	},

// 	/**
// 	 * Method: onUpdate
// 	 * event haldler for beforefeaturemodified
// 	 */
// 	onUpdate: function(event){
// 		//console.log("old feature geometry: " + event.feature.geometry);
// 		feature = event.feature.clone();
// 		feature.fid = event.feature.fid;
// 		feature.state = event.feature.state;
// 		feature.layer = event.feature.layer;
// 		this.onEdit(feature,"Update",feature.layer.name);
// 	},

// 	/**
// 	 * Method: setEditIndex
// 	 * increase the editIndex
// 	 */
// 	setEditIndex: function(delta){
// 		delta = delta ? delta : 1;
// 		this.currentEditIndex += delta;
// 	},

// 	/**
// 	 * Method: getUndoData
// 	 * returns the last edited data
// 	 */
// 	getUndoData: function(){
// 		var data = this.undoFeatures.pop();
// 		this.currentEditIndex -= 1;
// 		return data;
// 	},

// 	/* Method: getRedoData
// 	 * returns the last redo data
// 	 */
// 	getRedoData: function() {
// 		var data = this.redoFeatures.pop();
// 		this.currentEditIndex += 1;
// 		return data;
// 	},

// 	/**
// 	 * APIMethod: reseteditIndex
// 	 * reset the editIndex to 0 and empety both undo and redo stack
// 	 */
// 	resetEditIndex: function(){
// 		this.currentEditIndex = 0;
// 		this.undoFeatures.splice(0,this.undoFeatures.length);
// 		this.redoFeatures.splice(0,this.redoFeatures.length);
// 	},

// 	/**
// 	 * APIMethod: undo
// 	 * perform undo operation
// 	 */
// 	undo: function() {
// 		data = this.getUndoData();
// 		//console.log("data :" + data);
// 		for (component in data){
// 			//console.log("component: "+component);
// 			layer=map.getLayersByName(component)[0];
// 			//console.log("got layer, name: " + layer.name);
// 			for (editType in data[component]){
// 				//console.log("edittype : "+editType);
// 				for(var i=0;i<data[component][editType].length;i++){
// 					feature=data[component][editType][i];
// 					//console.log("features before undo: "+layer.features.length);
// 					switch(editType) {
// 						case "Insert":
// 							//console.log("insert");
// 							//layer.drawFeature(feature,{display : "none"});
// 							insertedFeature = layer.getFeatureByFid(feature.fid);
// 							layer.eraseFeatures(insertedFeature);
// 							OpenLayers.Util.removeItem(layer.features,insertedFeature);
// 							break;
// 						case "Delete":
// 							//console.log("delete");
// 							layer.features.push(feature);
// 							layer.drawFeature(feature);
// 							break;
// 						case "Update":
// 							//console.log("update");
// 							updatedFeature = layer.getFeatureByFid(feature.fid);
// 							//console.log("old feature geometry: " + feature.geometry);
// 							//console.log("updated feature geometry: " + updatedFeature.geometry);
// 							//layer.drawFeature(updatedFeature,{display : "none"});
// 							layer.eraseFeatures(updatedFeature);
// 							OpenLayers.Util.removeItem(layer.features,updatedFeature);
// 							//layer.removeFeatures(updatedFeature);
// 							//console.log("old feature geometry: " + feature.geometry);
// 							layer.features.push(feature);
// 							layer.drawFeature(feature);
// 							data[component][editType][i]= updatedFeature;
// 							break;
// 						default:
// 							//console.log("unkown");
// 							break;
// 					}
// 					//console.log("features after undo: "+layer.features.length);
// 				}
// 			}
// 		}
// 		this.redoFeatures.push(data);
// 	},

// 	/**
// 	 * APIMethod:  redo
// 	 * perform redo operation
// 	 */

// 	redo: function(){
// 		data =this.getRedoData();
// 		for( component in data) {
// 			//console.log("component: "+component);
// 			layer=map.getLayersByName(component)[0];
// 			//console.log("got layer, name: " + layer.name);
// 			for(editType in data[component]){
// 				//console.log("edittype : "+editType);
// 				for (var i=0;i<data[component][editType].length;i++){
// 					feature=data[component][editType][i];
// 					//console.log("features before redo: "+layer.features.length);
// 					switch(editType) {
// 						case "Insert":
// 							//console.log("Insert");
// 							layer.features.push(feature);
// 							layer.drawFeature(feature);
// 							break;
// 						case "Delete":
// 							//console.log("Delete");
// 							deleteFeature = layer.getFeatureByFid(feature.fid)
// 							layer.eraseFeatures(deleteFeature);
// 							OpenLayers.Util.removeItem(layer.features,deleteFeature);
// 							break;
// 						case "Update":
// 							//console.log("Update");
// 							oldFeature = layer.getFeatureByFid(feature.fid);
// 							//console.log("old feature id: " + oldFeature.id);
// 							layer.eraseFeatures(oldFeature);
// 							OpenLayers.Util.removeItem(layer.features,oldFeature);
// 							//console.log("updated feature id: " + oldFeature.id);
// 							layer.features.push(feature);
// 							layer.drawFeature(feature);
// 							data[component][editType][i]= oldFeature;
// 							break;
// 						default:
// 							break;
// 					}
// 				}
// 			}
// 		}
// 		this.undoFeatures.push(data);
// 	},

// 	CLASS_NAME : "UndoRedo"
// });


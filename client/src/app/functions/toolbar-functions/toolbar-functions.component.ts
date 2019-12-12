import {Component, ViewChild, ElementRef, AfterViewInit, OnInit, Input, Optional, Output, EventEmitter} from '@angular/core';
import { defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap, Zoom} from 'ol/control';
import { Map, View, Collection, MapBrowserEvent } from 'ol';
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
import { Icon, Stroke, Style, Fill, Circle } from 'ol/style';
import { SpoorwegenService } from 'src/app/layers/spoorwegen.service';
import { BestuurlijkegrenzenService } from 'src/app/layers/bestuurlijkegrenzen.service';
import { BagService } from 'src/app/layers/bag.service';
import { OverigeDienstenService } from 'src/app/layers/overigediensten.service';
import { LayerButton } from '../buttons-functions/layerbutton/layerbutton.service';
import { ServiceService } from 'src/app/pdokmap/pdokmapconfigmap/service.service';
import { BgService } from 'src/app/pdokmap/layer/bg.service';
import { GeocoderService } from 'angular-geocoder';
import {defaults as defaultInteractions, Modify, Select, Snap, Translate, Draw} from 'ol/interaction';
import LayerGroup from 'ol/layer/Group';
import { getLocaleId } from '@angular/common';
import { LayerbuttonComponent } from '../../functions/buttons-functions/layerbutton/layerbutton.component';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'app-toolbar-functions',
  templateUrl: './toolbar-functions.component.html',
  styleUrls: ['./toolbar-functions.component.css']
})
export class ToolbarFunctionsComponent implements AfterViewInit {

  // ALLE OUTPUTS
  @Output() _mapswitch: EventEmitter<any> = new EventEmitter<any>();
  @Output() _styleswitch: EventEmitter<any> = new EventEmitter<any>();
  @Output() _placefound: EventEmitter<any> = new EventEmitter<any>();
  @Output() _zoomin: EventEmitter<any> = new EventEmitter<any>();
  @Output() _zoomout: EventEmitter<any> = new EventEmitter<any>();
  @Output() _undo: EventEmitter<any> = new EventEmitter<any>();
  @Output() _redo: EventEmitter<any> = new EventEmitter<any>();
  @Output() _getButtonColorBlue: EventEmitter<any> = new EventEmitter<any>();
  @Output() _getButtonColorGreen: EventEmitter<any> = new EventEmitter<any>();
  @Output() _getButtonColorRed: EventEmitter<any> = new EventEmitter<any>();

  // ALLE INPUTS

  // ALLE SHOW FUNCTIONS
  show1 = false;  show2 = false;   show3 = false;
  show4 = false;  show5 = false;   show6 = false;
  show7 = false;  show8 = false;   show9 = false;
  show10 = false; show11 = false; show12 = false;
  show13 = false; show14 = false; show15 = false;
  grenzenvisi = false;           bagvisi = false;
  spoorvisi = false;        dienstenvisi = false;

  tooltip;

  // GEOLOCATOR
  public searchInput = '';
  public places = [];
  public collations = [];
  public searchThreshold = 2;
  public foundPlace: any = null;
  public selectedItem = [];
  public selectedIndex = -1;

  // TEKENFUNCTIE
  private draw: OlDraw;
  typeSelectTekenen = new FormControl('');
  typeSelectStyle = new FormControl('');
  colortest = new Style({});

  constructor(
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private overigedienstenSerivce: OverigeDienstenService,
    private buttonforlayers: LayerButton,
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    public geocoderService: GeocoderService
  ) {}

  ngAfterViewInit() {}

  // FUNCTIONS VOOR TOOLBAR BUTTONS
  UndoButton() {return this._undo.emit(); }
  RedoButton() {return this._redo.emit(); }
  onPlaceFound(place) { return this._placefound.emit(place); }
  SaveButton() {console.log('klik op de save knop'); }
  zoom_in()  {console.log('klik op zoom in knop'); return this._zoomin.emit(); }
  zoom_out() {console.log('klik op zoom out knop'); return this._zoomout.emit(); }

  // MAPBUTTONS
  getKaartButton() {return this.buttonforlayers.getLayerGroupKaart(); }
  getGrenzenButton() {return this.buttonforlayers.getLayerGroupGrenzen(); }
  getBagButton() {return this.buttonforlayers.getLayerGroupBag(); }
  getDienstenButton() {return this.buttonforlayers.getLayerGroupOverigeDiensten(); }
  getSpoorButton() {return this.buttonforlayers.getLayerGroupSpoorwegen(); }

  // GET COLOR
  getButtonColorBlue() {
    if (this.typeSelectStyle.value !== '') {
      return this._getButtonColorBlue.emit(this.typeSelectStyle.value);
    }
    return this._getButtonColorBlue.emit('');
  }

  getButtonColorGreen() {
    if (this.typeSelectStyle.value !== '') {
      return this._getButtonColorGreen.emit(this.typeSelectStyle.value);
    }
    return this._getButtonColorGreen.emit('');
  }
  getButtonColorRed() {
    if (this.typeSelectStyle.value !== '') {
      return this._getButtonColorRed.emit(this.typeSelectStyle.value);
    }
    return this._getButtonColorRed.emit('');
  }

  // CLICK SELECT
  clickonselect() {console.log('clickonselect'); }

  // SWITCHMODE
  switchMode() {
    if (this.typeSelectTekenen.value !== '') {
      return this._mapswitch.emit(this.typeSelectTekenen.value);
    }
    return this._mapswitch.emit('');
  }
  styleswitch() {
    if (this.typeSelectStyle.value !== '') {
      return this._styleswitch.emit(this.typeSelectStyle.value);
    }
    return this._styleswitch.emit('');
  }
}

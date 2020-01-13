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
import GeoJSON from 'ol/format/GeoJSON';
import {defaults as defaultControls, Control, ZoomToExtent, Rotate, ScaleLine, ZoomSlider, OverviewMap, Zoom} from 'ol/control';
import {defaults as defaultInteractions, Modify, Snap, Draw } from 'ol/interaction';
import LayerGroup from 'ol/layer/Group';
import { getLocaleId } from '@angular/common';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { style } from '@angular/animations';
import {click, pointerMove, altKeyOnly, singleClick} from 'ol/events/condition';
import Select, { SelectEvent } from 'ol/interaction/Select';
import { transformExtent, addProjection, fromLonLat, toLonLat, transform, get,  } from 'ol/proj';
import { transformGeom2D } from 'ol/geom/SimpleGeometry';
import ImageLayer from 'ol/layer/Image';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
import Translate from 'ol/interaction/Translate';
import Transform from 'ol-ext/interaction/transform';
import TileSource from 'ol/source/Tile';
import { SpoorwegenService } from 'src/app/layers/spoorwegen.service';
import { BestuurlijkegrenzenService } from 'src/app/layers/bestuurlijkegrenzen.service';
import { BagService } from 'src/app/layers/bag.service';
import { OverigeDienstenService } from 'src/app/layers/overigediensten.service';
import { LayerButton } from 'src/app/functions/buttons-functions/layerbutton/layerbutton.service';
import { ServiceService } from 'src/app/pdokmap/pdokmapconfigmap/service.service';
import { BgService } from 'src/app/pdokmap/layer/bg.service';
import { GeocoderService } from 'angular-geocoder';
import Geolocation from 'ol//Geolocation';
// import { coordinate, events } from 'openlayers';
import Point from 'ol/geom/Point';
import {register} from 'ol/proj/proj4';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent implements OnInit {
  private map: Map;
  private draw: OlDraw;
  checked = false;
  highlightsource = new VectorSource({wrapX: false, });
  highlight = new VectorLayer({
    source: this.highlightsource, style: new Style({fill: new Fill({color: 'pink'}),
     stroke: new Stroke({color: 'Black', width: 3}),
     image: new Circle({radius: 7, fill: new Fill({color: '#ffcc33'})
     })
    })
  });
  posfeaturesource = new VectorSource({wrapX: false});
  posfeaturelayer = new VectorLayer({source: this.posfeaturesource});
  private view = new View({
    center: [150000, 450000],
    projection: 'EPSG:28992',
    zoom: 2,
    minZoom: 0,
    maxZoom: 15
  });

  public geolocation: Geolocation;

  positionhtml;

  constructor(
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private bagService: BagService,
    private overigedienstenSerivce: OverigeDienstenService,
    private buttonforlayers: LayerButton,
    private mapconfig: ServiceService,
    private achterkaart: BgService,
    public geocoderService: GeocoderService,
  ) { }

  ngOnInit() {
   this.initializeMap();
   this.initializeGeolocation();
  }

  initializeMap() { // BEGIN VAN DE MAP MAKEN
    // addProjection(this.mapconfig.projection);
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
        // this.tekenfunctie,
        this.highlight,
        this.posfeaturelayer,
      ],
      view: this.view,
      controls: [
        // new Control({ element: this.toolbarmenu.nativeElement }),
        // new Control({ element: this.dragmenu.nativeElement }),
        // new Control({ element: this.drawmenu.nativeElement }),
        // new Control({ element: this.geosetmenu.nativeElement }),
      ]
    });
   } // EINDE VAN DE MAP MAKEN


  initializeGeolocation() {
    console.log(this.view.getProjection());
    console.log('initGeolocation');
    this.geolocation = new Geolocation({
      projection: 'EPSG:28992',
      trackingOptions: {
        enableHighAccuracy: true,
      }
    });
    this.geolocation.on('change', (e) => {
      this.posfeaturesource.clear();
      const coordinates = this.geolocation.getPosition();
      const feature = new Feature(new Point(coordinates));
      feature.setStyle(new Style({
        image: new Circle({
         radius: 6,
         fill: new Fill({
          color: 'red'
         }),
         stroke: new Stroke({
          color: 'red',
          width: 2
         })
       })
      }));
      this.posfeaturesource.addFeature(feature);
     });
  }

  el(event) {
   this.geolocation.setTracking(event.target.checked);
  }
}


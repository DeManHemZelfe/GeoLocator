import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Map, Feature } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import { FormControl } from '@angular/forms';
import OlDraw from 'ol/interaction/Draw';
import TileWMS, { Options as TileWMSOptions } from 'ol/source/TileWMS';
import { Vector as VectorSource, ImageWMS, WMTS } from 'ol/source';
import { Stroke, Style, Fill, Circle } from 'ol/style';
import { BestuurlijkegrenzenService } from '../layers/bestuurlijkegrenzen.service';
import { BagService } from '../layers/bag.service';
import GeoJSON from 'ol/format/GeoJSON';
import { SpoorwegenService, ITileOptions } from '../layers/spoorwegen.service';
import { defaults as defaultControls, Control } from 'ol/control';
import { OverigeDienstenService } from '../layers/overigediensten.service';
import { defaults as defaultInteractions, Modify, Snap } from 'ol/interaction';
import { GeocoderService } from 'angular-geocoder';
import { LayerButton } from '../functions/buttons-functions/layerbutton/layerbutton.service';
import { ServiceService } from '../pdokmap/pdokmapconfigmap/service.service';
import { BgService } from '../pdokmap/layer/bg.service';
import Select from 'ol/interaction/Select';
import { addProjection } from 'ol/proj';
import Translate from 'ol/interaction/Translate';
import Transform from 'ol-ext/interaction/transform';
import { Polygon, LineString, MultiPoint, Point } from 'ol/geom';
import { getArea, getLength } from 'ol/sphere';
import GeometryType from 'ol/geom/GeometryType';
import { AdresService } from '../kaarten/kaart-lagen/overig/adressen/adres.service';
import {render3D} from 'ol-ext/layer/Render3D.js';

// "./node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
// https://github.com/mirismaili/angular-material-dynamic-themes#demo de github demo
// https://www.youtube.com/watch?v=ZKXv_ZHQ654 yt video
@Component({
  selector: 'app-kaartviewer',
  templateUrl: './kaartviewer.component.html',
  styleUrls: ['./kaartviewer.component.css']
})
export class KaartviewerComponent implements AfterViewInit {
  // OpenDialog
  opened2 = true;
  opened3 = true;
  opened4 = true;
  opened5 = true;
  opened6 = true;

  // MAP
  private map: Map;

  // MAP INTERACTIONS FUNCTIONS
  Interactionselect = new Select();
  InteractionTranlate = new Translate({
    features: this.Interactionselect.getFeatures()
  });
  InteractionTransform: Transform;

  // FORMCONTROLS
  typeSelectTekenen = new FormControl('');
  typeSelectStyle = new FormControl('');
  kleurschema: any;
  ColorWheel = 'rgba(255, 255, 255, 0.2)';

  // TEKENFUNCTIE TEKENEN
  private draw: OlDraw;
  tekensource = new VectorSource({ wrapX: false });
  tekenfunctie = new VectorLayer({
    source: this.tekensource,
    style: new Style({
      fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new Circle({
        radius: 5,
        stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.7)' }),
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' })
      })
    })
  });
  highlightsource = new VectorSource({ wrapX: false });
  highlight = new VectorLayer({
    source: this.highlightsource,
    style: new Style({
      fill: new Fill({ color: 'pink' }),
      stroke: new Stroke({ color: 'Black', width: 3 }),
      image: new Circle({ radius: 7, fill: new Fill({ color: '#ffcc33' }) })
    })
  });

  // TEKENFUNCTIE METEN
  MeetSource = new VectorSource({});
  MeetLayer = new VectorLayer({
    source: this.MeetSource,
    style: new Style({
      fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new Circle({
        radius: 5,
        stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.7)' }),
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' })
      })
    })
  });
  // MEET TOOLTIP
  output: any;
  sketch: any;
  measureTooltipElement: HTMLElement;
  tooltipcoord: any;
  measureTooltip: Overlay;

  // TEKEN SETTINGS
  Meetmodify = new Modify({ source: this.MeetSource });
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

  // Undo-Array
  undoArray = [];
  dataUndoArray = [];
  dataUndoMeetArray = [];
  dataActiveArray = [];

  // Redo-Array
  RedoArray = [];
  dataRedoArray = [];

  // Feature's-Array
  objectarray = [];
  BagArray = [];
  AdresArray = [];

  // Teken-Array
  drawArray = [];
  drawMeetArray = [];

  // User-Array
  UserLayers = [];

  // Legenda-Array
  LegendaArray = [];
  ActiveLegenda = [];
  mysource: any;


  // Test omgeving
  // theCircle = new Feature(new Circle([5e6, 7e6, 5e5], 1e6));
  //
  // Controllers for the Map
  @ViewChild('PopUpMenu', { static: false }) PopUpMenu: ElementRef;
  @ViewChild('PopUpAdresMenu', { static: false }) PopUpAdresMenu: ElementRef;
  @ViewChild('searchmenu', { static: false }) searchmenu: ElementRef;
  @ViewChild('dragmenu', { static: false }) dragmenu: ElementRef;
  @ViewChild('drawmenu', { static: false }) drawmenu: ElementRef;
  @ViewChild('droplayermenu', { static: false }) droplayermenu: ElementRef;
  @ViewChild('geosetmenu', { static: false }) geosetmenu: ElementRef;

  constructor(
    private spoorwegService: SpoorwegenService,
    private bestuurlijkegrenzenservice: BestuurlijkegrenzenService,
    private adresService: AdresService,
    private bagService: BagService,
    private overigedienstenSerivce: OverigeDienstenService,
    private mapconfig: ServiceService,
    private button: LayerButton,
    private achterkaart: BgService,
    public geocoderService: GeocoderService
  ) {}
  // Open Menu
  open4() { this.opened4 = false; }
  open5() { this.opened5 = false; }
  // Close Menu
  close4() { this.opened4 = true; }
  close5() { this.opened5 = true; }

  // After the page load in
  ngAfterViewInit() {
    this.initializeMap();
    this.addInteraction();
    this.addMeetInteraction();
  }

  // Maak de map
  initializeMap() {
    addProjection(this.mapconfig.projection);
    this.map = new Map({
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
        new Control({ element: this.searchmenu.nativeElement }),
        new Control({ element: this.dragmenu.nativeElement }),
        new Control({ element: this.drawmenu.nativeElement }),
        new Control({ element: this.droplayermenu.nativeElement }),
        new Control({ element: this.geosetmenu.nativeElement })
      ]
    });
    this.mapClick();
  }
  Settings() { console.log('Settings'); }
  changeThemeColor(event) {
   const click = event.type;
   if (click) {
    const getId = document.getElementById('debody');
    const getName = document.getElementsByClassName('body');

    if (getName) {
     const getBgStyle = window.getComputedStyle(getName[0], null).getPropertyValue('background-color');
     const getCStyle = window.getComputedStyle(getName[0], null).getPropertyValue('color');
     console.log(getBgStyle);
     console.log(getCStyle);
    }

    if (getId.style) {
     getId.style.backgroundColor = 'pink';
     getId.style.color = 'blue';
    }
   }
  }
  // Maak het tooltip divje
  createMeasureTooltip() {
    const bottom = 'bottom-right';
    const center = bottom as OverlayPositioning;
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(
        this.measureTooltipElement
      );
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: center
    });
    this.map.addOverlay(this.measureTooltip);
  }

  // Maak de meter en kilometers lijn
  formatLength(line: any) {
    const length = getLength(line);
    if (length > 100) {
      this.output = Math.round((length / 1000) * 1000) / 100 + '' + 'km';
    } else {
      this.output = Math.round(length * 1000) / 100 + '' + 'm';
    }
    return this.output;
  }
  formatArea(polygon: any) {
    const area = getArea(polygon);
    if (area > 10000) {
      this.output =
        Math.round((area / 1000000) * 100) / 100 + '' + 'km<sup>2</sup>';
    } else {
      this.output = Math.round(area * 100) / 100 + '' + 'm<sup>2</sup>';
    }
    return this.output;
  }

  // Maak de meet interactie
  addMeetInteraction() {
    const Fillcolor = this.ColorWheel;
    const Drawtype = this.typeSelectTekenen.value;
    if (this.typeSelectTekenen.value !== '') {
      this.draw = new OlDraw({
        source: this.MeetSource,
        type: Drawtype as GeometryType,
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
      this.map.addInteraction(this.Meetsnap);
      this.createMeasureTooltip();

      this.draw.on('drawstart', evt => {
        const Meetsketch = evt.feature;
        Meetsketch.getGeometry().on('change', _event => {
          evt.feature.setStyle(
            new Style({
              fill: new Fill({ color: Fillcolor }),
              stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                width: 3,
                lineDash: [10, 10]
              }),
              image: new Circle({
                radius: 5,
                stroke: new Stroke({ color: 'yellow' }),
                fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' })
              })
            })
          );
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

      this.draw.on('drawend', event => {
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        this.measureTooltip.setOffset([0, -7]);
        this.sketch = null;
        this.measureTooltipElement = null;
        this.createMeasureTooltip();
        this.drawMeetArray.push(event.feature);
      });
    }
  }

  // Zet de SnapInteractie aan of uit
  EnableInteractions(event: any) {
    if (event === 'snap') {
      this.map.addInteraction(this.snap);
      this.map.addInteraction(this.Meetsnap);
    }
    if (event === 'modify') {}
    if (event === '') {
      this.map.removeInteraction(this.snap);
      this.map.removeInteraction(this.Meetsnap);
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

  // Als je op de Map klikt
  mapClick() {
    this.map.on('singleclick', evt => {
      const viewResolution = this.mapconfig._view.getResolution();
      this.map.forEachLayerAtPixel(evt.pixel, layer => {
        const source = layer.getSource();
        if (layer.getVisible() === false) { this.highlightsource.clear(); }

        if ((source as any).getLegendUrl) {
          const legenda = (source as any).getLegendUrl(viewResolution, {
            FORMAT: 'image/png'
          });

          if (legenda) {
            this.mysource = legenda;
            this.LegendaArray.push(legenda);
            this.ActiveLegenda.push(legenda);
          }
          if ((source as any).getFeatureInfoUrl) {
            const url = (source as any).getFeatureInfoUrl(
              evt.coordinate,
              viewResolution,
              'EPSG:28992',
              { INFO_FORMAT: 'application/json' }
            );
            console.log(url);

            if (url) {
              fetch(url).then(response => {
                response.json().then(geojsonData => {
                  const features = new GeoJSON({
                    dataProjection: 'EPSG:28992',
                    featureProjection: 'EPSG:28992'
                  }).readFeatures(geojsonData);
                  const Bagname = features[0].get('bouwjaar');
                  const Adresnaam = features[0].get('huisnummer');

                  if (Adresnaam) {
                    const pushNewFeature = features[0].getProperties();
                    const index = this.AdresArray.findIndex(
                      x => x === pushNewFeature
                    );
                    this.AdresArray.splice(index, 1);
                    this.AdresArray.push(pushNewFeature);
                    this.open5();
                    console.log(features[0].getProperties());
                    console.log(Adresnaam);
                  }

                  if (Bagname) {
                    const pushNewFeature = features[0].getProperties();
                    const index = this.BagArray.findIndex(
                      x => x === pushNewFeature
                    );
                    this.BagArray.splice(index, 1);
                    this.BagArray.push(pushNewFeature);
                    this.highlightsource.clear();
                    this.highlightsource.addFeature(features[0]);
                    this.open4();
                    console.log(features[0].getProperties());
                    console.log(Bagname);
                  } else {
                    if (features[0]) {
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
        }
      });
    });
  }

  RemoveHighLight(event: any) {
    if (event === true) {
    } else if (event === false) {
      this.highlightsource.clear();
    }
  }

  // Gebruiker maakt een layer aan
  AddLayer(event: any) {
    const NewLayerTitle = event;
    const UserTile = new TileWMS({
      params: { LAYERS: NewLayerTitle, TILED: true },
      crossOrigin: 'anonymous'
    });

    const UserLayer = new TileLayer({
      source: UserTile,
      visible: true
    } as ITileOptions);

    if (NewLayerTitle === 'lfroutes') {
      UserTile.setUrl('https://geodata.nationaalgeoregister.nl/lfroutes/wms?');
      UserTile.setProperties({ title: NewLayerTitle });
      UserLayer.setProperties({ title: NewLayerTitle });
      this.UserLayers.push(UserLayer);
      this.map.addLayer(UserLayer);
    }
    if (NewLayerTitle === 'bbg2015' || NewLayerTitle === 'BBG2015_hoofdgroep') {
      UserTile.setUrl(
        'https://geodata.nationaalgeoregister.nl/bestandbodemgebruik2015/wms?'
      );
      UserTile.setProperties({ title: NewLayerTitle });
      UserLayer.setProperties({ title: NewLayerTitle });
      this.UserLayers.push(UserLayer);
      this.map.addLayer(UserLayer);
    }
    if (
      NewLayerTitle === 'weggegaantalrijbanen' ||
      NewLayerTitle === 'weggegmaximumsnelheden'
    ) {
      UserTile.setUrl('https://geodata.nationaalgeoregister.nl/weggeg/wms?');
      UserTile.setProperties({ title: NewLayerTitle });
      UserLayer.setProperties({ title: NewLayerTitle });
      this.map.addLayer(UserLayer);
      this.UserLayers.push(UserLayer);
    }
    if (NewLayerTitle === 'bevolkingskernen2011:cbsbevolkingskernen2011') {
      UserTile.setUrl(
        'https://geodata.nationaalgeoregister.nl/bevolkingskernen2011/wms?'
      );
      UserTile.setProperties({ title: NewLayerTitle });
      UserLayer.setProperties({ title: NewLayerTitle });
      this.UserLayers.push(UserLayer);
    }
  }

  // Draw Interactie
  addInteraction() {
    const Fillcolor = this.ColorWheel;
    const value = this.typeSelectTekenen.value;
    if (value !== '') {
      this.map.removeInteraction(this.snap);
      this.draw = new OlDraw({ source: this.tekensource, type: value });

      this.draw.on('drawstart', evt => {});

      this.draw.on('drawend', event => {
        event.feature.setStyle(
          new Style({
            fill: new Fill({ color: Fillcolor }),
            stroke: new Stroke({ color: 'Red', width: 3 }),
            image: new Circle({
              radius: 5,
              stroke: new Stroke({ color: 'yellow' }),
              fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' })
            })
          })
        );
        this.drawArray.push(event.feature);
        console.log(event.feature.getProperties());
        console.log(event.feature.getGeometry());
        // console.log(event.feature);
        // console.log(event.feature.getGeometry());
        // console.log(event.feature.getProperties());

      });
      this.map.addInteraction(this.draw);
      this.map.addInteraction(this.snap);
    }
  }

  // Verander de geom
  switchDrawMode(event: any) {
    if (event !== '') {
      this.typeSelectTekenen.setValue(event);
    } else {
      this.typeSelectTekenen.setValue('');
    }
    this.map.removeInteraction(this.draw);
    this.addInteraction();
  }

  // Verander de kleur
  StyleColorSwitch(Stylevent: any) {
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
  select() {
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.Interactionselect);
    this.map.removeInteraction(this.InteractionTranlate);
    this.map.removeInteraction(this.InteractionTransform);
  }
  transform() {
    this.InteractionTransform = new Transform({
      rotate: true,
      scale: true,
      translate: true,
      noFlip: true,
      stretch: true,
      translateFeature: true
    });
    this.map.addInteraction(this.InteractionTransform);
  }
  onPlaceFound(place: any) {
    this.map.getView().animate({ center: place.centroide_rd.coordinates, zoom: 12 });
    console.log(place);
  }
}
